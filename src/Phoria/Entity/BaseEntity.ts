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

    // TODO: invert
    multiply(m: Matrix4) {
        this.matrix.multiply(m);
        return this;
    }

    scale(vec: Vector3) {
        Matrix4.scale(this.matrix, this.matrix, vec);
        return this;
    }

    scaleN(n: number) {
        const v = Vector3.fromValues(n, n, n);
        Matrix4.scale(this.matrix, this.matrix, v);
        return this;
    }

    rotate(rad: number, axis: Vector3) {
        Matrix4.rotate(this.matrix, this.matrix, rad, axis);
        return this;
    }

    rotateX(rad: number) {
        Matrix4.rotateX(this.matrix, this.matrix, rad);
        return this;
    }

    rotateY(rad: number) {
        Matrix4.rotateY(this.matrix, this.matrix, rad);
        return this;
    }

    rotateZ(rad: number) {
        Matrix4.rotateZ(this.matrix, this.matrix, rad);
        return this;
    }

    rotateYPR(yaw: number, pitch: number, roll: number) {
        const m = Matrix4.fromYPR(yaw, pitch, roll);
        this.matrix.multiply(m);
    }

    translate(vec: Vector3) {
        Matrix4.translate(this.matrix, this.matrix, vec);
        return this;
    }

    translateX(n: number) {
        const v = Vector3.fromValues(n, 0, 0);
        Matrix4.translate(this.matrix, this.matrix, v);
        return this;
    }

    translateY(n: number) {
        const v = Vector3.fromValues(0, n, 0);
        Matrix4.translate(this.matrix, this.matrix, v);
        return this;
    }

    translateZ(n: number) {
        const v = Vector3.fromValues(0, 0, n);
        Matrix4.translate(this.matrix, this.matrix, v);
        return this;
    }

    determinant() {
        return this.matrix.determinant();
    }

    transpose() {
        Matrix4.transpose(this.matrix, this.matrix);
        return this;
    }
}
