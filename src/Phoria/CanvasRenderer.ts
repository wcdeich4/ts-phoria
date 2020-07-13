import Renderer from './Renderer';
import Scene from './Scene';
import { Entity } from './Entity';
import { Polygon, Edge } from './Interfaces';
import { Vector3, Vector4, TWOPI } from '../Math';
import { averagePolyVertex } from './Utils';

export default class CanvasRenderer extends Renderer {
    canvas: HTMLCanvasElement;

    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }

    render(scene : Scene, fnClear: (ctx: CanvasRenderingContext2D) => void | null) {
        this.sortObjects(scene);
        // clear the canvas before rendering begins - optional clearing function can be supplied
        if (!fnClear) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            fnClear(this.ctx);
        }
        // scene performs all local, world and projection calculations and flattens the rendering list ready for rendering.
        scene.renderList.forEach((entity) => {
            const obj = entity;
            this.ctx.save();
            if (obj.style.compositeOperation) {
                this.ctx.globalCompositeOperation = obj.style.compositeOperation;
            }
            if (obj.style.drawmode === 'solid') {
                // ensure line width is set if appropriate fillmode is being used
                if (obj.style.fillmode === 'fillstroke' || obj.style.fillmode === 'hiddenline') {
                    this.ctx.lineWidth = 1.0;
                }
                // render the pre-sorted polygons
                obj.polygons.forEach((polygon) => {
                    this.renderPolygon(obj, scene, polygon);
                });
            } else if (obj.style.drawmode === 'wireframe') {
                this.ctx.lineWidth = obj.style.linewidth;
                this.ctx.globalAlpha = obj.style.opacity;
                if (obj.style.shademode === 'plain') {
                    const [r, g, b] = obj.style.color;
                    this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    this.ctx.beginPath();
                    obj.edges.forEach((edge) => {
                        this.renderEdge(obj, scene, edge);
                    });
                    this.ctx.closePath();
                    this.ctx.stroke();
                } else {
                    obj.edges.forEach((edge) => {
                        this.renderEdge(obj, scene, edge);
                    });
                }
            } else if (obj.style.drawmode === 'point') {
                // assert to ensure that the texture image referenced by the 'sprite' index exists
                if (obj.style.shademode === 'sprite' && obj.style.sprite !== undefined) {
                    if (!obj.textures) {
                        throw new Error('Entity has shademode "sprite" '
                            + 'but no textures defined on parent emitter.');
                    }
                    if (obj.style.sprite > obj.textures.length - 1) {
                        throw new Error('Entity has shademode "sprite" '
                            + 'index but references missing texture on parent emitter.');
                    }
                }
                this.ctx.globalAlpha = obj.style.opacity;
                const { coords } = obj;
                if (obj.style.shademode === 'plain') {
                    const [r, g, b] = obj.style.color;
                    this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                }
                coords.forEach((vertex, i) => {
                    this.renderPoint(obj, scene, vertex, i);
                });
            }
            this.ctx.restore();
        });
    }

    renderPoint(obj: Entity, scene: Scene, coord: Vector4, index: number) {
        // perform clip of point if vertex has been marked for clipping
        if (obj.clip[index]) {
            return;
        }
        let w = obj.style.linewidth;
        if (obj.style.linescale !== 0) {
            // use the perspective divisor to calculate line width scaling
            // try to keep this calculation in sync with scene point clipOffset calculation
            w = (obj.style.linewidth * obj.style.linescale * scene.perspectiveScale)
                / obj.coords[index][3];
        }
        if (obj.style.shademode === 'plain') {
            this.ctx.beginPath();
            this.ctx.arc(coord[0], coord[1], w, 0, TWOPI, true);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (obj.style.shademode === 'sprite') {
            if (obj.style.sprite !== undefined && obj.style.sprite !== null) {
                this.ctx.drawImage(obj.textures[obj.style.sprite],
                    coord[0] - w, coord[1] - w, w + w, w + w);
            }
        } else if (obj.style.shademode === 'callback') {
            // optional rendering callback functions
            if (obj.onRenderHandlers !== null) {
                obj.onRenderHandlers.forEach((handler) => {
                    handler.call(obj, this.ctx, coord[0], coord[1], w);
                });
            }
        } else if (obj.style.shademode === 'lightsource') {
            // lighting calc
            const rgb = CanvasRenderer.calcPositionBrightness(obj.worldcoords[index].getVector3(),
                scene.lights);
            const r = Math.min(Math.ceil(rgb[0] * obj.style.color[0]), 255);
            const g = Math.min(Math.ceil(rgb[1] * obj.style.color[1]), 255);
            const b = Math.min(Math.ceil(rgb[2] * obj.style.color[2]), 255);
            this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.beginPath();
            this.ctx.arc(coord[0], coord[1], w, 0, TWOPI, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    renderEdge(obj: Entity, scene: Scene, edge: Edge) {
        // perform clip of edge if all vertices have been marked for clipping
        if (obj.clip[edge.a] && obj.clip[edge.b]) {
            return;
        }
        const { coords } = obj;
        if (obj.style.linescale !== 0) {
            // use the perspective divisor to calculate line width scaling
            this.ctx.lineWidth = ((obj.style.linewidth * obj.style.linescale)
                / ((obj.coords[edge.a][3] + obj.coords[edge.b][3]) * 0.5)) * scene.perspectiveScale;
        }
        // lighting calc
        if (obj.style.shademode === 'lightsource') {
            const edgea = obj.worldcoords[edge.a];
            const edgeb = obj.worldcoords[edge.b];
            const position = Vector3.fromValues((edgea[0] + edgeb[0]) * 0.5,
                (edgea[1] + edgeb[1]) * 0.5,
                (edgea[2] + edgeb[2]) * 0.5);
            const rgb = CanvasRenderer.calcPositionBrightness(position, scene.lights);
            this.ctx.beginPath();
            const r = Math.min(Math.ceil(rgb[0] * obj.style.color[0]), 255);
            const g = Math.min(Math.ceil(rgb[1] * obj.style.color[1]), 255);
            const b = Math.min(Math.ceil(rgb[2] * obj.style.color[2]), 255);
            this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
            // draw an edge
            this.ctx.moveTo(coords[edge.a][0], coords[edge.a][1]);
            this.ctx.lineTo(coords[edge.b][0], coords[edge.b][1]);
            this.ctx.closePath();
            this.ctx.stroke();
        } else {
            // draw an edge
            this.ctx.moveTo(coords[edge.a][0], coords[edge.a][1]);
            this.ctx.lineTo(coords[edge.b][0], coords[edge.b][1]);
        }
    }

    renderPolygon(obj: Entity, scene: Scene, poly: Polygon) {
        const { coords, clip } = obj;
        const { vertices } = poly;
        const color = poly.color || obj.style.color;
        const opacity = poly.opacity || obj.style.opacity;
        let fillStyle = null;
        let emit = 0.0;
        let rgb = null;

        // clip of poly if all vertices have been marked for clipping
        let clippoly = 1;
        vertices.forEach((vertex) => {
            // eslint-disable-next-line no-bitwise
            clippoly &= clip[vertex];
        });
        if (clippoly) {
            return;
        }
        // hidden surface removal - use area sign in screen space calculation rather than normal to camera
        // as normal dot test will only work for orthogonal projection not perspective projection
        if (!obj.style.doublesided) {
            const signal = (
                coords[vertices[0]][0] * coords[vertices[1]][1]
                - coords[vertices[1]][0] * coords[vertices[0]][1]
            ) + (
                coords[vertices[1]][0] * coords[vertices[2]][1]
                - coords[vertices[2]][0] * coords[vertices[1]][1]
            ) + (
                coords[vertices[2]][0] * coords[vertices[0]][1]
                - coords[vertices[0]][0] * coords[vertices[2]][1]
            );
            if (signal < 0) {
                return;
            }
        }
        // generate fill style based on lighting mode
        if (obj.style.shademode === 'plain') {
            if (obj.style.texture === undefined && poly.texture === undefined) {
                const [r, g, b] = color;
                fillStyle = `${r}, ${g}, ${b}`;
            }
        } else if (obj.style.shademode === 'lightsource') {
            // this performs a pass for each light - a simple linear-additive lighting model
            rgb = CanvasRenderer.calcNormalBrightness(
                averagePolyVertex(vertices, obj.worldcoords),
                poly.worldnormal.getVector3(),
                scene,
                obj,
            );
            if (poly.emit || obj.style.emit) {
                emit = poly.emit || obj.style.emit;
            }
            // generate style string for canvas fill (integers in 0-255 range)
            const r = Math.min(Math.ceil(rgb[0] * color[0] + color[0] * emit), 255);
            const g = Math.min(Math.ceil(rgb[1] * color[1] + color[1] * emit), 255);
            const b = Math.min(Math.ceil(rgb[2] * color[2] + color[1] * emit), 255);
            fillStyle = `${r}, ${g}, ${b}`;
        }
        // render the polygon - textured or one of the solid fill modes
        this.ctx.save();
        if (obj.style.texture || poly.texture) {
            const idx = poly.texture ? poly.texture : obj.style.texture;
            const bitmap = obj.textures[idx];
            const fRenderTriangle = (
                vs: [number, number][],
                sx0: number,
                sy0: number,
                sx1: number,
                sy1: number,
                sx2: number,
                sy2: number,
            ) => {
                const x0 = vs[0][0];
                const y0 = vs[0][1];
                const x1 = vs[1][0];
                const y1 = vs[1][1];
                const x2 = vs[2][0];
                const y2 = vs[2][1];
                this.ctx.beginPath();
                this.ctx.moveTo(x0, y0);
                this.ctx.lineTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();
                this.ctx.clip();
                // Textured triangle transformation code originally by Thatcher Ulrich
                // TODO: figure out if drawImage goes faster if we specify the rectangle that bounds the source coords.
                // TODO: this is far from perfect - due to perspective corrected texture mapping issues see:
                //       http://tulrich.com/geekstuff/canvas/perspective.html
                // collapse terms
                const denom = 1.0 / (sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0);
                // calculate context transformation matrix
                const m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) * denom;
                const m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) * denom;
                const m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) * denom;
                const m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) * denom;
                const dx = (sx0 * (sy2 * x1 - sy1 * x2)
                    + sy0 * (sx1 * x2 - sx2 * x1)
                    + (sx2 * sy1 - sx1 * sy2) * x0) * denom;
                const dy = (sx0 * (sy2 * y1 - sy1 * y2)
                    + sy0 * (sx1 * y2 - sx2 * y1)
                    + (sx2 * sy1 - sx1 * sy2) * y0) * denom;
                this.ctx.transform(m11, m12, m21, m22, dx, dy);
                // Draw the whole texture image. Transform and clip will map it onto the correct output polygon.
                this.ctx.globalAlpha = opacity;
                this.ctx.drawImage(bitmap, 0, 0);
            };
            if (fillStyle !== null) {
                // convert RGB to grey scale level
                let alpha = rgb[0] * 0.3 + rgb[1] * 0.6 + rgb[2] * 0.1;
                if (alpha > 1.0) {
                    alpha = 1.0;
                }
                // fix to N decimal places to avoid eExp notation on toString()!
                const a = (1.0 - alpha).toFixed(3);
                this.ctx.fillStyle = `rgba(${fillStyle}, ${a})`;
            }
            // we can only deal with triangles for texturing - a quad must be split into two triangles
            // TODO: needs a triangle subdivision algorithm for > 4 verticies
            if (vertices.length === 3) {
                let tx0 = 0;
                let ty0 = 0;
                let tx1 = bitmap.width;
                let ty1 = 0;
                let tx2 = bitmap.width;
                let ty2 = bitmap.height;
                if (poly.uvs) {
                    tx0 = bitmap.width * poly.uvs[0];
                    ty0 = bitmap.height * poly.uvs[1];
                    tx1 = bitmap.width * poly.uvs[2];
                    ty1 = bitmap.height * poly.uvs[3];
                    tx2 = bitmap.width * poly.uvs[4];
                    ty2 = bitmap.height * poly.uvs[5];
                }
                // TODO: Chrome does not need the texture poly inflated!
                const inflatedVertices = CanvasRenderer.inflatePolygon(vertices, coords, 0.5);
                fRenderTriangle.call(this, inflatedVertices, tx0, ty0, tx1, ty1, tx2, ty2);
                // apply optional color fill to shade and light the texture image
                if (fillStyle !== null) {
                    this.ctx.fill();
                }
            } else if (vertices.length === 4) {
                let tx0 = 0;
                let ty0 = 0;
                let tx1 = bitmap.width;
                let ty1 = 0;
                let tx2 = bitmap.width;
                let ty2 = bitmap.height;
                if (poly.uvs) {
                    tx0 = bitmap.width * poly.uvs[0];
                    ty0 = bitmap.height * poly.uvs[1];
                    tx1 = bitmap.width * poly.uvs[2];
                    ty1 = bitmap.height * poly.uvs[3];
                    tx2 = bitmap.width * poly.uvs[4];
                    ty2 = bitmap.height * poly.uvs[5];
                }
                this.ctx.save();
                // TODO: Chrome does not need the texture poly inflated!
                let inflatedVertices = CanvasRenderer.inflatePolygon(vertices.slice(0, 3),
                    coords, 0.5);
                fRenderTriangle.call(this, inflatedVertices, tx0, ty0, tx1, ty1, tx2, ty2);
                this.ctx.restore();

                tx0 = bitmap.width;
                ty0 = bitmap.height;
                tx1 = 0;
                ty1 = bitmap.height;
                tx2 = 0;
                ty2 = 0;
                if (poly.uvs) {
                    tx0 = bitmap.width * poly.uvs[4];
                    ty0 = bitmap.height * poly.uvs[5];
                    tx1 = bitmap.width * poly.uvs[6];
                    ty1 = bitmap.height * poly.uvs[7];
                    tx2 = bitmap.width * poly.uvs[0];
                    ty2 = bitmap.height * poly.uvs[1];
                }
                this.ctx.save();
                const v = [
                    vertices[2],
                    vertices[3],
                    vertices[0],
                ];
                // TODO: Chrome does not need the texture poly inflated!
                inflatedVertices = CanvasRenderer.inflatePolygon(v, coords, 0.5);
                fRenderTriangle.call(this, inflatedVertices, tx0, ty0, tx1, ty1, tx2, ty2);
                this.ctx.restore();
                // apply optional color fill to shade and light the texture image
                if (fillStyle !== null) {
                    // TODO: better to inflate again or fill two tris as above?
                    inflatedVertices = CanvasRenderer.inflatePolygon(vertices, coords, 0.75);
                    this.ctx.beginPath();
                    vertices.forEach((vertex, i) => {
                        if (i === 0) {
                            this.ctx.moveTo(inflatedVertices[0][0], inflatedVertices[0][1]);
                            return;
                        }
                        this.ctx.lineTo(inflatedVertices[i][0], inflatedVertices[i][1]);
                    });
                    this.ctx.closePath();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.fill();
                }
            }
        } else {
            // solid colour fill
            if (obj.style.fillmode === 'inflate') {
                // inflate the polygon screen coords to cover the 0.5 pixel cracks between canvas fill()ed polygons
                const inflatedVertices = CanvasRenderer.inflatePolygon(vertices, coords, 0.5);
                this.ctx.beginPath();
                vertices.forEach((vertex, index) => {
                    if (index === 0) {
                        this.ctx.moveTo(inflatedVertices[0][0], inflatedVertices[0][1]);
                        return;
                    }
                    this.ctx.lineTo(inflatedVertices[index][0], inflatedVertices[index][1]);
                });
                this.ctx.closePath();
            } else {
                this.ctx.beginPath();
                vertices.forEach((vertex, index) => {
                    if (index === 0) {
                        // move to first point in the polygon
                        this.ctx.moveTo(coords[vertices[0]][0], coords[vertices[0]][1]);
                        return;
                    }
                    // move to each additional point
                    this.ctx.lineTo(coords[vertices[index]][0], coords[vertices[index]][1]);
                });
                // no need to plot back to first point - as path closes shape automatically
                this.ctx.closePath();
            }
            fillStyle = `rgba(${fillStyle}, ${opacity})`;
            if (obj.style.fillmode === 'fill') {
                // single fill - fastest but leaves edge lines
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
            } else if (obj.style.fillmode === 'filltwice') {
                // double fill causes "overdraw" towards edges - slightly slower
                // but removes enough of the cracks for dense objects and small faces
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
                this.ctx.fill();
            } else if (obj.style.fillmode === 'inflate') {
                // inflate (also called 'buffering') the polygon in 2D by a small ammount
                // and then a single fill can be used - increase in pre calculation time
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
            } else if (obj.style.fillmode === 'fillstroke') {
                // single fill - followed by a stroke line - nicer edge fill but slower
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
                this.ctx.strokeStyle = fillStyle;
                this.ctx.stroke();
            } else if (obj.style.fillmode === 'hiddenline') {
                // stroke only - to produce hidden line wire effect
                this.ctx.strokeStyle = fillStyle;
                this.ctx.stroke();
            }
        }
        this.ctx.restore();
    }
}
