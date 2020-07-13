import { Vector3, Matrix4 } from '../../Math';

export default class BaseEntity {
    matrix: Matrix4 = new Matrix4();

    children: [];

    id: null | string = null;

    disabled: boolean = false;

    onBeforeSceneHandlers: Function[] = [];

    onSceneHandlers: Function[] = [];

    onBeforeScene(fn: Function) {
        if (this.onBeforeSceneHandlers === null) this.onBeforeSceneHandlers = [];
        this.onBeforeSceneHandlers = this.onBeforeSceneHandlers.concat(fn);
    }

    onScene(fn: Function) {
        if (this.onSceneHandlers === null) this.onSceneHandlers = [];
        this.onSceneHandlers = this.onSceneHandlers.concat(fn);
    }

    identity() {
        this.matrix.identity();
    }

    invert() {
        this.matrix.invert();
        return this;
    }

    multiply(m: Matrix4) {
        this.matrix.multiply(m);
        return this;
    }

    scale(vec: Vector3) {
        this.matrix.scale(vec);
        return this;
    }

    scaleN(n: number) {
        const v = Vector3.fromValues(n, n, n);
        this.matrix.scale(v);
        return this;
    }

    rotate(rad: number, axis: Vector3) {
        this.matrix.rotate(rad, axis);
        return this;
    }

    rotateX(rad: number) {
        this.matrix.rotateX(rad);
        return this;
    }

    rotateY(rad: number) {
        this.matrix.rotateY(rad);
        return this;
    }

    rotateZ(rad: number) {
        this.matrix.rotateZ(rad);
        return this;
    }

    rotateYPR(yaw: number, pitch: number, roll: number) {
        const m = Matrix4.fromYPR(yaw, pitch, roll);
        this.matrix.multiply(m);
    }

    translate(vec: Vector3) {
        this.matrix.translate(vec);
        return this;
    }

    translateX(n: number) {
        const v = Vector3.fromValues(n, 0, 0);
        this.matrix.translate(v);
        return this;
    }

    translateY(n: number) {
        const v = Vector3.fromValues(0, n, 0);
        this.matrix.translate(v);
        return this;
    }

    translateZ(n: number) {
        const v = Vector3.fromValues(0, 0, n);
        this.matrix.translate(v);
        return this;
    }

    determinant() {
        return this.matrix.determinant();
    }

    transpose() {
        this.matrix.transpose();
        return this;
    }
}
