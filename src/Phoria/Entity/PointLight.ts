import BaseLight from './BaseLight';
import { Vector3, Vector4, Matrix4 } from '../../Math';
import Scene from '../Scene';

export default class PointLight extends BaseLight {
    position: {
        x: number;
        y: number;
        z: number;
    };

    worldPosition: null | Vector3 = null;

    attenuation: 0.1;

    attenuationFactor: string;

    constructor() {
        super();
        this.position = {
            x: 0,
            y: 0,
            z: -1,
        };
        this.attenuation = 0.1;
        this.attenuationFactor = 'linear';
        // add scene handler to transform the light position into world position
        this.onScene(this.transformToScene);
    }

    transformToScene(scene: Scene, matLocal: Matrix4) : void {
        // update worldposition position of light by local transformation -> world
        const vec = Vector4.fromValues(
            this.position.x,
            this.position.y,
            this.position.z,
            1,
        );
        vec.transform(matLocal);
        this.worldPosition = vec.getVector3();
    }
}
