import BaseLight from './BaseLight';
import { Vector3 } from '../../Math';

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
}
