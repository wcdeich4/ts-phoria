import Scene from './Scene';
import { Vector3, Vector4, EPSILON } from '../Math';
import {
    Entity,
    BaseLight,
    DistantLight,
    PointLight,
} from './Entity';

export default class Renderer {
    sort = true;

    sortObjects(scene: Scene) : void {
        if (!this.sort) {
            return;
        }
        scene.renderList.forEach((entity) => {
            // ensure we have an average z coord for the objects to test
            const obj = entity;
            if (obj.style.objectsortmode === 'sorted') {
                // average z coord is calculated during scene processing
            } else if (obj.style.objectsortmode === 'front') {
                // to the front - remember the Z direction is reversed
                obj.averagez = Number.MIN_VALUE;
            } else {
                // to the back - remember the Z direction is reversed
                obj.averagez = Number.MAX_VALUE;
            }
        });
        scene.renderList.sort((a, b) => {
            if (a.averagez < b.averagez) {
                return 1;
            }
            return -1;
        });
    }

    static calcNormalBrightness(
        position: Vector3,
        normal: Vector3,
        scene: Scene,
        obj: Entity,
    ) : [number, number, number] {
        const rgb : [number, number, number] = [0.0, 0.0, 0.0];
        const { lights } = scene;
        lights.forEach((value) => {
            const light = value;
            let brightness = 0;
            if (light instanceof DistantLight) {
                // Distant lights have no "position", just a direction - they light the world with parallel rays
                // from an infinitely distant location - closest example is light from the sun when overhead
                // note that light worlddirection is precalculated as negative.
                const dotVP = normal.dot(light.worlddirection);
                // don't waste any more time calculating if the dot product is negative i.e. > 90 degrees
                if (dotVP <= 0) {
                    return;
                }
                // combine light intensity with dot product and object diffuse value
                brightness = dotVP * light.intensity * obj.style.diffuse;
            } else if (light instanceof PointLight) {
                // Point lights have a position and a fall-off known as attenuation
                // distance falloff calculation - each light is additive to the total
                const vecToLight = Vector3.subtract(position, light.worldPosition);
                const distance = vecToLight.length();
                let attenuation = 0;
                vecToLight.normalize().negate();
                const dotVP = normal.dot(vecToLight);
                // don't waste any more time calculating if the dot product is negative i.e. > 90 degrees
                if (dotVP <= 0) {
                    return;
                }
                if (light.attenuationFactor === 'squared') {
                    attenuation = light.attenuation * distance * distance;
                } else if (light.attenuationFactor === 'linear') {
                    attenuation = light.attenuation * distance;
                } else {
                    attenuation = light.attenuation;
                }
                // Optional specular highlight calculation
                if (obj.style.specular !== 0) {
                    const halfV = Vector3.add(vecToLight, scene.cameraPosition);
                    halfV.normalize();
                    const dotHV = normal.dot(halfV);
                    const pf = ((dotHV ** obj.style.specular) * light.intensity)
                        / attenuation;
                    rgb[0] += pf * light.color[0];
                    rgb[1] += pf * light.color[1];
                    rgb[2] += pf * light.color[2];
                }
                brightness = ((obj.style.diffuse * dotVP) * light.intensity)
                    / attenuation;
            }
            // apply each colour component based on light levels (0.0 to 1.0)
            rgb[0] += brightness * light.color[0];
            rgb[1] += brightness * light.color[1];
            rgb[2] += brightness * light.color[2];
        });
        return rgb;
    }

    static calcPositionBrightness(
        position: Vector3,
        lights: BaseLight[],
    ) : [number, number, number] {
        const rgb : [number, number, number] = [0.0, 0.0, 0.0];
        lights.forEach((value) => {
            const light = value;
            let brightness = 0;
            if (light instanceof DistantLight) {
                // Distant lights have no "position"
                brightness = light.intensity;
            } else if (light instanceof PointLight) {
                // Point lights have a position and a fall-off known as attenuation
                const vecToLight = Vector3.subtract(position, light.worldPosition);
                const distance = vecToLight.length();
                let attenuation = 0;
                vecToLight.normalize();
                if (light.attenuationFactor === 'squared') {
                    attenuation = light.attenuation * distance * distance;
                } else if (light.attenuationFactor === 'linear') {
                    attenuation = light.attenuation * distance;
                } else {
                    attenuation = light.attenuation;
                }
                // NOTE: increasing attenuation to try to light wires similar brightness to polygons that
                //       are lit by the same light - other options would be to properly calculate the lighting
                //       normal based on the polygons that share the edges - this would mean more complicated
                //       object descriptions - but provide much more accurate wireframe/point lighting...
                brightness = light.intensity / (attenuation * 2);
            }
            // apply each colour component based on light levels (0.0 to 1.0)
            rgb[0] += brightness * light.color[0];
            rgb[1] += brightness * light.color[1];
            rgb[2] += brightness * light.color[2];
        });
        return rgb;
    }

    static inflatePolygon(
        vertices: number[],
        coords: Vector4[],
        pixelsInflate: number | null,
    ) : Array<[number, number]> {
        const pixels = pixelsInflate || 0.5;
        const inflatedVertices = new Array<[number, number]>(vertices.length);
        vertices.forEach((vertex, index) => {
            inflatedVertices[index] = [coords[vertex][0], coords[vertex][1]];
        });
        const j = vertices.length;
        for (let i = 0; i < j; i += 1) {
            const k = (i < j - 1) ? (i + 1) : 0;
            const x1 = inflatedVertices[i][0];
            const y1 = inflatedVertices[i][1];
            const x2 = inflatedVertices[k][0];
            const y2 = inflatedVertices[k][1];
            let x = x2 - x1;
            let y = y2 - y1;

            let det = x * x + y * y;
            if (det === 0) {
                det = EPSILON;
            }
            const idet = pixels / Math.sqrt(det);
            x *= idet;
            y *= idet;
            inflatedVertices[i][0] -= x;
            inflatedVertices[i][1] -= y;
            inflatedVertices[k][0] += x;
            inflatedVertices[k][1] += y;
        }
        return inflatedVertices;
    }

    static inflatePolygonFull(
        vertices: number[],
        coords: Vector4[],
        pixelsInflate: number | null,
    ) : Array<[number, number]> {
        const pixels = pixelsInflate || 0.5;
        // generate vertices of parallel edges
        const pedges = [];
        const inflatedVertices = new Array<[number, number]>(vertices.length);
        const j = vertices.length;
        vertices.forEach((vertex, index) => {
            // collect an edge
            const x1 = coords[vertex][0];
            const y1 = coords[vertex][1];
            let x2 = 0;
            let y2 = 0;
            if (index + 1 < j - 1) {
                // eslint-disable-next-line prefer-destructuring
                x2 = coords[vertices[index + 1]][0];
                // eslint-disable-next-line prefer-destructuring
                y2 = coords[vertices[index + 1]][1];
            } else {
                // eslint-disable-next-line prefer-destructuring
                x2 = coords[vertices[0]][0];
                // eslint-disable-next-line prefer-destructuring
                y2 = coords[vertices[0]][1];
            }
            // compute outward facing normal vector - and normalise the length
            let dx = y2 - y1;
            let dy = -(x2 - x1);
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            // multiply by the distance to the parallel edge
            dx *= pixels;
            dy *= pixels;
            // generate and store parallel edge
            pedges.push({
                x: x1 + dx,
                y: y1 + dy,
            });
            pedges.push({
                x: x2 + dx,
                y: y2 + dy,
            });
        });
        // calculate intersections to build new screen coords for inflated poly
        vertices.forEach((vertex, index) => {
            let vec = null;
            if (index === 0) {
                vec = Renderer.intersection(
                    pedges[(j - 1) * 2],
                    pedges[(j - 1) * 2 + 1],
                    pedges[0],
                    pedges[1],
                );
            } else {
                vec = Renderer.intersection(
                    pedges[(index - 1) * 2],
                    pedges[(index - 1) * 2 + 1],
                    pedges[index * 2],
                    pedges[index * 2 + 1],
                );
            }
            // handle edge case (haha) where inflated polygon vertex edges jump towards infinity
            if (Math.abs(vec[0] - coords[vertex][0]) > 1.5
                || Math.abs(vec[1] - coords[vertex][1]) > 1.5) {
                // reset to original coordinates
                // eslint-disable-next-line prefer-destructuring
                vec[0] = coords[vertex][0];
                // eslint-disable-next-line prefer-destructuring
                vec[1] = coords[vertex][1];
            }
            inflatedVertices[index] = vec;
        });
        return inflatedVertices;
    }

    static intersection(
        line0v0 : {x: number, y: number},
        line0v1: {x: number, y: number},
        line1v0: {x: number, y: number},
        line1v1: {x: number, y: number},
    ) : [number, number] {
        const a1 = line0v1.x - line0v0.x;
        const b1 = line1v0.x - line1v1.x;
        const c1 = line1v0.x - line0v0.x;
        const a2 = line0v1.y - line0v0.y;
        const b2 = line1v0.y - line1v1.y;
        const c2 = line1v0.y - line0v0.y;
        const t = (b1 * c2 - b2 * c1) / (a2 * b1 - a1 * b2);
        return [
            line0v0.x + t * (line0v1.x - line0v0.x),
            line0v0.y + t * (line0v1.y - line0v0.y),
        ];
    }
}
