/* eslint-disable prefer-destructuring */
import Vector4 from './Vector4';
// eslint-disable-next-line no-unused-vars
import Matrix4 from './Matrix4';

export default class Vector3 {
    constructor() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
    }

    toVector4() {
        const v = new Vector4();
        v[0] = this[0];
        v[1] = this[1];
        v[2] = this[2];
        v[3] = 0;
        return v;
    }

    normalize() {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this[0] = x * len;
            this[1] = y * len;
            this[2] = z * len;
        }
    }

    static transformMat4(output: Vector3, a: Vector3, m: Matrix4) {
        const out = output;
        const x = a[0];
        const y = a[1];
        const z = a[2];
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        return out;
    }

    static dot(a : Vector3, b: Vector3) : number {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    static fromValues(vx: number, vy: number, vz: number) {
        const v = new Vector3();
        v[0] = vx;
        v[1] = vy;
        v[2] = vz;
        return v;
    }

    static subtract(output: Vector3, a: Vector3, b: Vector3) {
        const out = output;
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
    }

    static add(output: Vector3, a: Vector3, b: Vector3) {
        const out = output;
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        return out;
    }

    static magnitude(a: Vector3) {
        const x = a[0];
        const y = a[1];
        const z = a[2];
        return Math.sqrt(x * x + y * y + z * z);
    }

    static negate(output: Vector3, a: Vector3) {
        const out = output;
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        return out;
    }
}
