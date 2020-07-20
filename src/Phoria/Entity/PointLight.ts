import BaseLight from './BaseLight';
import { SceneHandler, BeforeSceneHandler } from './BaseEntity';
import { Vector3, Vector4, Matrix4 } from '../../Math';
import Scene from '../Scene';

export default class PointLight extends BaseLight {
    position: {
        x: number;
        y: number;
        z: number;
    };

    worldPosition: null | Vector3 = null;

    attenuation = 0.1;

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

    static create(desc: {
        id?: string | null;
        matrix?: Matrix4 | null;
        children?: [] | null;
        onBeforeScene?: BeforeSceneHandler | null;
        onScene?: SceneHandler | null;
        disabled?: boolean | null;
        color?: [number, number, number];
        intensity?: number;
        position?: Vector3;
        attenuation?: number;
        attenuationFactor?: 'none' | 'linear' | 'squared';
    }): PointLight {
        const e = new PointLight();
        if (desc.id) e.id = desc.id;
        if (desc.matrix) e.matrix = desc.matrix;
        if (desc.children) e.children = desc.children;
        if (desc.onBeforeScene) e.onBeforeScene(desc.onBeforeScene);
        if (desc.onScene) e.onScene(desc.onScene);
        if (desc.disabled !== undefined && desc.disabled !== null) {
            e.disabled = desc.disabled;
        }
        if (desc.color) e.color = desc.color;
        if (desc.intensity) e.intensity = desc.intensity;
        if (desc.position) {
            e.position = {
                x: desc.position[0],
                y: desc.position[1],
                z: desc.position[2],
            };
        }
        if (desc.attenuation) e.attenuation = desc.attenuation;
        if (desc.attenuationFactor) e.attenuationFactor = desc.attenuationFactor;
        return e;
    }
}
