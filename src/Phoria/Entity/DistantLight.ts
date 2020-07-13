import BaseLight from './BaseLight';
import { Vector3, Matrix4 } from '../../Math';

export default class DistantLight extends BaseLight {
    direction : {
        x: number;
        y: number;
        z: number;
    };

    worlddirection: Vector3 | null;

    constructor() {
        super();
        this.direction = {
            x: 0,
            y: 0,
            z: 1,
        };
        // add scene handler to transform the light position into world position
        this.onScene(this.transformToScene);
    }

    transformToScene() {
        this.worlddirection = Vector3.fromValues(
            -this.direction.x,
            -this.direction.y,
            -this.direction.z,
        );
    }

    static create(desc: {
        id?: string | null;
        matrix?: Matrix4 | null;
        children?: [] | null;
        onBeforeScene?: Function | null;
        onScene?: Function | null;
        disabled?: boolean | null;
        color?: [number, number, number];
        intensity?: number;
        direction?: Vector3;
    }): DistantLight {
        const e = new DistantLight();
        if (desc.id) e.id = desc.id;
        if (desc.matrix) e.matrix = desc.matrix;
        if (desc.children) e.children = desc.children;
        if (desc.onBeforeScene) e.onBeforeScene(desc.onBeforeScene);
        if (desc.onScene) e.onScene(desc.onScene);
        if (desc.disabled !== undefined) e.disabled = desc.disabled;
        if (desc.color) e.color = desc.color;
        if (desc.intensity) e.intensity = desc.intensity;
        if (desc.direction) {
            desc.direction.normalize();
            e.direction = {
                x: desc.direction[0],
                y: desc.direction[1],
                z: desc.direction[2],
            };
        }
        return e;
    }
}
