import Scene from '../Scene';
import { Vector3, Matrix4 } from '../../Math';

export type BeforeSceneHandler =
    (scene: Scene, time: number) => void;

export type SceneHandler =
    (scene: Scene, matLocal: Matrix4, time: number) => void;

export default class BaseEntity {
    matrix: Matrix4 = new Matrix4();

    children: BaseEntity[] = [];

    id: null | string = null;

    disabled = false;

    onBeforeSceneHandlers: BeforeSceneHandler[] = [];

    onSceneHandlers: SceneHandler[] = [];

    onBeforeScene(fn: BeforeSceneHandler) : void {
        if (this.onBeforeSceneHandlers === null) {
            this.onBeforeSceneHandlers = [];
        }
        this.onBeforeSceneHandlers = this.onBeforeSceneHandlers.concat(fn);
    }

    onScene(fn: SceneHandler) : void {
        if (this.onSceneHandlers === null) {
            this.onSceneHandlers = [];
        }
        this.onSceneHandlers = this.onSceneHandlers.concat(fn);
    }

    identity(): BaseEntity {
        this.matrix.identity();
        return this;
    }

    invert(): BaseEntity {
        this.matrix.invert();
        return this;
    }

    multiply(m: Matrix4): BaseEntity {
        this.matrix.multiply(m);
        return this;
    }

    scale(vec: Vector3): BaseEntity {
        this.matrix.scale(vec);
        return this;
    }

    scaleN(n: number): BaseEntity {
        const v = Vector3.fromValues(n, n, n);
        this.matrix.scale(v);
        return this;
    }

    rotate(rad: number, axis: Vector3): BaseEntity {
        this.matrix.rotate(rad, axis);
        return this;
    }

    rotateX(rad: number): BaseEntity {
        this.matrix.rotateX(rad);
        return this;
    }

    rotateY(rad: number): BaseEntity {
        this.matrix.rotateY(rad);
        return this;
    }

    rotateZ(rad: number): BaseEntity {
        this.matrix.rotateZ(rad);
        return this;
    }

    rotateYPR(yaw: number, pitch: number, roll: number): BaseEntity {
        const m = Matrix4.fromYPR(yaw, pitch, roll);
        this.matrix.multiply(m);
        return this;
    }

    translate(vec: Vector3): BaseEntity {
        this.matrix.translate(vec);
        return this;
    }

    translateX(n: number): BaseEntity {
        const v = Vector3.fromValues(n, 0, 0);
        this.matrix.translate(v);
        return this;
    }

    translateY(n: number): BaseEntity {
        const v = Vector3.fromValues(0, n, 0);
        this.matrix.translate(v);
        return this;
    }

    translateZ(n: number): BaseEntity {
        const v = Vector3.fromValues(0, 0, n);
        this.matrix.translate(v);
        return this;
    }

    determinant(): number {
        return this.matrix.determinant();
    }

    transpose(): BaseEntity {
        this.matrix.transpose();
        return this;
    }
}
