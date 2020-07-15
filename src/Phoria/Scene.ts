import {
    RADIANS,
    Vector3,
    Vector4,
    Matrix4,
    EPSILON,
} from '../Math';
import { Entity, BaseEntity, BaseLight } from './Entity';
import { sortPolygons, sortEdges, sortPoints } from './Utils';

export type CameraHandler = (
    position : Vector3,
    lookat : Vector3,
    up: Vector3) => void;

class Scene {
    camera: {
        /**
         * up vector.
         */
        up: Vector3;
        /**
         * look at location.
         */
        lookat: Vector3;
        /**
         * position of the viewer.
         */
        position: Vector3;
    };

    perspective: {
        /**
         * vertical field-of-view in degrees.
         */
        fov: number;
        /**
         * aspect ratio of the view plane.
         */
        aspect: number;
        /**
         * near bound of the frustum.
         */
        near: number;
        /**
         * far bound of the frustum.
         */
        far: number;
    };

    /**
     * Scene viewport. typically this is set to the width and height of the canvas rendering area.
     */
    viewport: {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    lastTime = 0;

    cameraPosition: Vector4;

    perspectiveScale: number;

    graph: BaseEntity[];

    lights: BaseLight[];

    renderList: Entity[];

    triggerHandlers: {
        trigger: () => boolean;
    }[];

    entities: {
        [key: string]: BaseEntity;
    };

    onCameraHandlers: CameraHandler[] = [];

    constructor() {
        this.camera = {
            up: Vector3.fromValues(0.0, 1.0, 0.0),
            lookat: Vector3.fromValues(0.0, 0.0, 0.0),
            position: Vector3.fromValues(0.0, 0.0, -10.0),
        };
        this.perspective = {
            fov: 35.0,
            aspect: 1.0,
            near: 1.0,
            far: 10000.0,
        };
        this.viewport = {
            x: 0,
            y: 0,
            width: 1024,
            height: 1024,
        };

        this.graph = [];
        this.triggerHandlers = [];
    }

    // TODO: fromJSON?/toJSON?

    findEntity(id: string) : BaseEntity {
        return this.entities[id];
    }

    onCamera(fn: CameraHandler) : void {
        if (this.onCameraHandlers === null) {
            this.onCameraHandlers = [];
        }
        this.onCameraHandlers = this.onCameraHandlers.concat(fn);
    }

    modelView() : void {
        const now = Date.now();
        const time = (now - this.lastTime) / 1000;
        this.lastTime = now;

        const {
            x: vpx,
            y: vpy,
            width: fullvpw,
            height: fullvph,
        } = this.viewport;
        const vpw = fullvpw * 0.5;
        const vph = fullvph * 0.5;

        this.cameraPosition = this.camera.position.toVector4();
        const camera = new Matrix4();
        const cameraLookat = this.camera.lookat.toVector4();
        const cameraUp = this.camera.up.toVector4();

        if (this.onCameraHandlers !== null) {
            this.onCameraHandlers.forEach((handler) => {
                handler.call(
                    this,
                    this.camera.position,
                    this.camera.lookat,
                    this.camera.up,
                );
            });
        }
        // generate the lookAt matrix
        camera.lookAt(this.camera.position, this.camera.lookat, this.camera.up);
        // calculate perspective matrix for our scene
        const perspective = new Matrix4();
        perspective.perspective(-this.perspective.fov * RADIANS,
            this.perspective.aspect,
            this.perspective.near,
            this.perspective.far);

        // scaling factor used when rendering points to account for perspective fov
        this.perspectiveScale = (256 - this.perspective.fov) / 16;

        const renderList = [];
        const lights = [];
        const entityById = {};

        const fnProcessEntities = (entities : BaseEntity[], matParent : Matrix4) => {
            entities.forEach((myEntity) => {
                const obj = myEntity;
                // check disabled flag for this entity
                if (obj.disabled) {
                    return;
                }
                // construct entity lookup list by optional ID
                // used to quickly lookup entities in event handlers without walking child lists etc.
                if (obj.id) {
                    entityById[obj.id] = obj;
                }
                // hook point for onBeforeScene event handlers - custom user handlers or added by entities during
                // object construction - there can be multiple registered per entity
                if (obj.onBeforeSceneHandlers !== null) {
                    obj.onBeforeSceneHandlers.forEach((handler) => {
                        handler.call(obj, this, time);
                    });
                }
                // multiply local with parent matrix to combine affine transformations
                let matLocal = obj.matrix;
                if (matParent) {
                    // if local matrix is provided multiply it against parent matrix else use the parent matrix
                    if (matLocal) {
                        matLocal = matLocal.clone().multiply(matParent);
                    } else {
                        matLocal = matParent;
                    }
                }
                // hook point for onScene event handlers - custom user handlers or added by entities during
                // object construction - there can be multiple registered per entity
                if (obj.onSceneHandlers !== null) {
                    obj.onSceneHandlers.forEach((handler) => {
                        handler.call(obj, this, matLocal, time);
                    });
                }

                if (obj instanceof BaseLight) {
                    lights.push(obj);
                } else if (obj instanceof Entity) {
                    const { length } = obj.points;
                    // pre-create or reuse coordinate buffers for world, screen, normal and clip coordinates
                    obj.initCoordinateBuffers();
                    // set-up some values used during clipping calculations
                    let objClip = 0;
                    let clipOffset = 0;
                    if (obj.style.drawmode === 'point') {
                        // adjust vec by style linewidth calculation for linewidth scaled points or sprite points
                        // this allows large sprite/rendered points to avoid being clipped too early
                        if (obj.style.linescale === 0) {
                            clipOffset = obj.style.linewidth * 0.5;
                        } else {
                            clipOffset = ((obj.style.linewidth * obj.style.linescale)
                                / this.perspectiveScale) * 0.5;
                        }
                    }
                    // main vertex processing loop
                    let avz = 0;
                    obj.points.forEach((verts, index) => {
                        // construct homogeneous coordinate for the vertex as a vec4
                        let vec = obj.worldcoords[index].set(
                            verts[0],
                            verts[1],
                            verts[2],
                            1.0,
                        );
                        // local object transformation -> world space
                        // skip local transform if matrix not present
                        // else store locally transformed vec4 world points
                        if (matLocal) {
                            obj.worldcoords[index] = vec.getTransformed(matLocal);
                        }
                        // multiply by camera matrix to generate camera space coords
                        obj.cameracoords[index]
                            = obj.worldcoords[index].getTransformed(camera);
                        // multiply by perspective matrix to generate perspective and clip coordinates
                        obj.coords[index]
                            = obj.cameracoords[index].getTransformed(perspective);
                        // perspective division to create vec2 NDC then finally transform to viewport
                        // clip calculation occurs before the viewport transform
                        vec = obj.coords[index];
                        let w = vec[3];
                        // stop divide by zero
                        if (w === 0) {
                            w = EPSILON;
                        }
                        // is this vertex outside the clipping boundries for the perspective frustum?
                        obj.clip[index] = (vec[0] > w + clipOffset
                            || vec[0] < -w - clipOffset
                            || vec[1] > w + clipOffset
                            || vec[1] < -w - clipOffset
                            || vec[2] > w
                            || vec[2] < -w) ? 1 : 0;
                        objClip += obj.clip[index];
                        // perspective division
                        vec[0] /= w;
                        vec[1] /= w;
                        // Z is used by coarse object depth sort
                        // linear transform to viewport - could combine with division above - but for clarity it is not
                        vec[0] = vpw * vec[0] + vpx + vpw;
                        vec[1] = vph * vec[1] + vpy + vph;
                        // keep track of average Z here as it's no overhead and it's useful for rendering
                        avz += vec[2];
                    });
                    // store average Z coordinate
                    obj.averagez = length > 1 ? avz / length : avz;
                    // if entire object is clipped, do not bother with final steps or adding to render list
                    if (objClip !== length) {
                        // sort the geometry before any further transformations
                        //
                        // solid objects always need sorting as each poly can be a different shade/texture
                        // wireframe and points objects will not be sorted if the "plain" shademode is used
                        if (obj.style.geometrysortmode === 'sorted'
                            || obj.style.drawmode === 'solid'
                            || obj.style.shademode === 'lightsource') {
                            if (obj.style.drawmode === 'solid') {
                                sortPolygons(obj.polygons, obj.cameracoords);
                            } else if (obj.style.drawmode === 'wireframe') {
                                sortEdges(obj.edges, obj.cameracoords);
                            } else if (obj.style.drawmode === 'point') {
                                sortPoints(obj.coords, obj.worldcoords);
                            }
                        }
                        // normal lighting transformation
                        if (obj.style.drawmode === 'solid' && obj.polygons.length !== 0) {
                            // TODO: have a flag on scene for "transposedNormalMatrix..." - i.e. make it optional?
                            // invert and transpose the local model matrix - for correct normal scaling
                            const refMat = matLocal || new Matrix4();
                            const matNormals = refMat.getInverted();
                            matNormals.transpose();
                            if (obj.style.shademode === 'lightsource') {
                                // transform each polygon normal
                                obj.polygons.forEach((polygon) => {
                                    const poly = polygon;
                                    if (!poly.worldnormal) {
                                        poly.worldnormal = new Vector4();
                                    }
                                    // normal transformation -> world space
                                    const { normal, worldnormal } = poly;
                                    // use vec3 to ensure normal directional component is not modified
                                    const normal3 = normal.getVector3();
                                    // const worldnormal3 = worldnormal.getVector3();
                                    // Vector3.transformMat4(worldnormal3, normal3, matNormals);
                                    const worldnormal3
                                        = normal3.getTransformed(matNormals);
                                    worldnormal3.normalize();
                                    poly.worldnormal.set(
                                        worldnormal3[0],
                                        worldnormal3[1],
                                        worldnormal3[2],
                                        worldnormal[3],
                                    );
                                });
                            }
                            // TODO: gouraud?
                        }
                        // add to the flattened render list
                        renderList.push(obj);
                    }
                }
                // end entity processing
                // recursively process children
                if (obj.children && obj.children.length !== 0) {
                    fnProcessEntities.call(this, obj.children, matLocal);
                }
            });
        };
        fnProcessEntities.call(this, this.graph, null);
        // set the public references to the flattened list of objects to render and
        // the list of lights

        this.renderList = renderList;
        this.lights = lights;
        this.entities = entityById;

        // Process the scene trigger functions - this allows for real-time modification of the scene
        // based on a supplied handler function - a sequence of these triggers can nest and add new
        // triggers causing a sequence of events to perform chained actions to the scene as it executes.
        // Uses a for(...) loop to allow add/remove mods to the list during event processing.
        this.triggerHandlers.forEach((handler, index) => {
            if (handler.trigger.call(this, this.cameraPosition, cameraLookat, cameraUp)) {
                this.triggerHandlers.splice(index, 1);
            }
        });
    }
}

export default Scene;
