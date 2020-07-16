import Scene from './Scene';
import { Vector2, Vector3 } from '../Math';
import { planeLineIntersection, intersectionInsidePolygon } from './Utils';
import { Entity } from './Entity';

export interface MouseTrackingInstance {
    /**
     * The final target value from horizontal mouse movement.
     */
    velocityH: number;
    velocityLastH: number;
    positionX: number;
    /**
     * The last mouse click position X.
     */
    clickPositionX: number;
    /**
     * The final target value from vertical mouse movement.
     */
    velocityV: number;
    velocityLastV: number;
    positionY: number;
    /**
     * The last mouse click position Y.
     */
    clickPositionY: number;
    onMouseMove: ((evt: MouseEvent) => void) | null;
    onMouseUp: ((evt: MouseEvent) => void) | null;
    onMouseOut: ((evt: MouseEvent) => void) | null;
    onMouseDown: ((evt: MouseEvent) => void) | null;
}

export default class View {
    constructor() {
        throw new Error('The View class not instantiable.');
    }

    static events : {
        [key: string]: MouseTrackingInstance | undefined;
    } = {};

    static addMouseEvents(
        el: HTMLCanvasElement,
        fnOnClick?: (e: MouseEvent) => void,
    ) : MouseTrackingInstance | null {
        if (!el.id) {
            return null;
        }
        // mouse rotation and position tracking instance
        const mouse : MouseTrackingInstance = {
            velocityH: 0,
            velocityLastH: 0,
            positionX: 0,
            clickPositionX: 0,
            velocityV: 0,
            velocityLastV: 0,
            positionY: 0,
            clickPositionY: 0,
            onMouseMove: null,
            onMouseDown: null,
            onMouseOut: null,
            onMouseUp: null,
        };
        View.events = {
            ...View.events,
            [el.id]: mouse,
        };
        mouse.onMouseMove = (evt: MouseEvent) => {
            mouse.positionX = evt.clientX;
            mouse.velocityH
                = mouse.velocityLastH + (mouse.positionX - mouse.clickPositionX) * 0.5;
            mouse.positionY = evt.clientY;
            mouse.velocityV
                = mouse.velocityLastV + (mouse.positionY - mouse.clickPositionY) * 0.5;
        };
        mouse.onMouseUp = () => {
            if (!mouse.onMouseMove) {
                return;
            }
            el.removeEventListener('mousemove', mouse.onMouseMove, false);
        };
        mouse.onMouseOut = function onMouseOut() {
            if (!mouse.onMouseMove) {
                return;
            }
            el.removeEventListener('mousemove', mouse.onMouseMove, false);
        };
        mouse.onMouseDown = function onMouseDown(evt: MouseEvent) {
            evt.preventDefault();
            if (mouse.onMouseMove) {
                el.addEventListener('mousemove', mouse.onMouseMove, false);
            }
            mouse.clickPositionX = evt.clientX;
            mouse.velocityLastH = mouse.velocityH;
            mouse.clickPositionY = evt.clientY;
            mouse.velocityLastV = mouse.velocityV;
        };
        el.addEventListener('mousedown', mouse.onMouseDown, false);
        el.addEventListener('mouseup', mouse.onMouseUp, false);
        el.addEventListener('mouseout', mouse.onMouseOut, false);
        // add click handler if supplied
        if (fnOnClick) {
            el.addEventListener('click', fnOnClick, false);
        }
        return mouse;
    }

    static removeMouseEvents(
        el: HTMLCanvasElement,
        fnOnClick?: (e: MouseEvent) => void,
    ) : void {
        if (!el.id) {
            return;
        }
        const mouse = View.events[el.id];
        if (!mouse) {
            return;
        }
        if (mouse.onMouseMove) {
            el.removeEventListener('mousemove', mouse.onMouseMove, false);
        }
        if (mouse.onMouseDown) {
            el.removeEventListener('mousedown', mouse.onMouseDown, false);
        }
        if (mouse.onMouseUp) {
            el.removeEventListener('mouseup', mouse.onMouseUp, false);
        }
        if (mouse.onMouseOut) {
            el.removeEventListener('mouseout', mouse.onMouseOut, false);
        }
        if (fnOnClick) el.removeEventListener('click', fnOnClick, false);
        View.events = {
            ...View.events,
            [el.id]: undefined,
        };
    }

    static getMouse(el: HTMLCanvasElement) : MouseTrackingInstance | null {
        if (!el.id) {
            return null;
        }
        if (Object.prototype.hasOwnProperty.call(View.events, el.id)) {
            const obj = View.events[el.id];
            if (obj !== undefined) {
                return obj;
            }
        }
        return null;
    }

    static calculateClickPointAndVector(scene: Scene, mousex: number, mousey: number) : {
        clickPoint: Vector3;
        clickVector: Vector3;
    } {
        const camLookAt = Vector3.fromValues(
            scene.camera.lookat[0],
            scene.camera.lookat[1],
            scene.camera.lookat[2]);
        const camOff = Vector3.subtract(scene.cameraPosition.getVector3(), camLookAt);
        // get pixels per unit at click plane (plane normal to camera direction going through the camera focus point)
        const pixelsPerUnit = (scene.viewport.height / 2)
            / (camOff.length()
            * Math.tan((scene.perspective.fov / 180 * Math.PI) / 2));
        // calculate world units (from the centre of canvas) corresponding to the mouse click position
        const dif = Vector2.fromValues(
            mousex - (scene.viewport.width / 2),
            mousey - (scene.viewport.height / 2),
        );
        dif.subtract(Vector2.fromValues(8, 8)); // calibrate
        const units = Vector2.fromValues(dif[0], dif[1]).scale(1 / pixelsPerUnit);
        // move click point horizontally on click plane by the number of units calculated from the x offset of the mouse click
        const upVector = scene.camera.up.clone();
        const normalVectorSide = camOff.cross(upVector).normalize();
        const clickPoint = camLookAt.clone().scaleAndAdd(normalVectorSide, units[0]);
        // move click point vertically on click plane by the number of units calculated from the y offset of the mouse click
        const normalVectorUp = normalVectorSide.cross(camOff);
        normalVectorUp.normalize();
        normalVectorUp.scale(units[1]);
        clickPoint.subtract(normalVectorUp);
        // calculate click vector (vector from click point to the camera's position)
        const camVector = Vector3.add(camLookAt, camOff);
        return {
            clickPoint: clickPoint,
            clickVector: Vector3.subtract(clickPoint, camVector),
        };
    }

    static getIntersectedObjects(
        scene: Scene,
        clickPoint: Vector3,
        clickVector: Vector3,
    ) : {
        entity: Entity;
        polygonIndex: number;
        intersectionPoint: Vector3;
        distance: number;
    }[] {
        const intersections : {
            entity: Entity;
            polygonIndex: number;
            intersectionPoint: Vector3;
            distance: number;
        }[] = [];
        // Go through all the appropriate objects
        scene.renderList.forEach((renderItem) => {
            const obj = renderItem;
            // only consider solid objects
            if (obj.style.drawmode !== 'solid') {
                return;
            }
            // Go through all the polygons of an object
            obj.polygons.forEach((polygon, m) => {
                const polygonNormal = polygon.worldnormal.clone();
                const polygonPoint = obj.worldcoords[polygon.vertices[0]].clone();
                // Get the point where the line intersectects the polygon's plane
                const polygonPlaneIntersection = planeLineIntersection(
                    polygonNormal.getVector3(),
                    polygonPoint.getVector3(),
                    clickVector,
                    clickPoint,
                );
                if (polygonPlaneIntersection === null) {
                    return;
                }
                // Check if the intersection is inside the polygon
                if (intersectionInsidePolygon(
                    obj.polygons[m],
                    obj.worldcoords,
                    polygonPlaneIntersection,
                )) {
                    const returnObject = {
                        entity: obj,
                        polygonIndex: m,
                        intersectionPoint: polygonPlaneIntersection,
                        distance: 0,
                    };
                    intersections.push(returnObject);
                }
            });
        });
        // calculate distance to each intersection from camera's position
        const cameraPos = scene.cameraPosition.getVector3();
        for (let i = 0; i < intersections.length; i += 1) {
            intersections[i].distance = Vector3.distance(
                cameraPos,
                intersections[i].intersectionPoint,
            );
        }
        // sort intersection points from closest to farthest
        for (let i = 0; i < intersections.length - 1; i += 1) {
            for (let j = i + 1, keepVal; j < intersections.length; j += 1) {
                if (intersections[i].distance >= intersections[j].distance) {
                    keepVal = intersections[j];
                    intersections[j] = intersections[i];
                    intersections[i] = keepVal;
                }
            }
        }
        // return list of all intersections
        return intersections;
    }
}
