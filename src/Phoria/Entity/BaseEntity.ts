import { Matrix4 } from '../../Math';

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
    // TODO: multiply
    // TODO: scale
    // TODO: scaleN
    // TODO: rotate
    // TODO: rotateX

    rotateY(rad: number) {
        Matrix4.rotateY(this.matrix, this.matrix, rad);
        return this;
    }

    // TODO: rotateZ
    // TODO: rotateYPR
    // TODO: translate
    // TODO: translateX
    // TODO: translateY
    // TODO: translateZ
    // TODO: determinant
    // TODO: transpose
}
