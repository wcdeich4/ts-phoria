// eslint-disable-next-line no-unused-vars
import Matrix4 from './Matrix4';
import Vector3 from './Vector3';

export default class Vector4 {
    constructor() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
    }

    getVector3() : Vector3 {
        const v = new Vector3();
        const x = this[0];
        const y = this[1];
        const z = this[2];
        v[0] = x;
        v[1] = y;
        v[2] = z;
        return v;
    }

    static fromValues(vx: number, vy: number, vz: number, vw: number) {
        const v = new Vector4();
        v[0] = vx;
        v[1] = vy;
        v[2] = vz;
        v[3] = vw;
        return v;
    }

    static set(vector: Vector4, x: number, y: number, z: number, w: number) {
        const v = vector;
        v[0] = x;
        v[1] = y;
        v[2] = z;
        v[3] = w;
        return v;
    }

    static transformMat4(output: Vector4, a : Vector4, m : Matrix4) {
        const x = a[0];
        const y = a[1];
        const z = a[2];
        const w = a[3];
        const out = output;
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return out;
    }
}
