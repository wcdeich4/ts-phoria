import Matrix4 from './Matrix4';
import Vector3 from './Vector3';

/**
 * 4 Dimensional Vector.
 */
export default class Vector4 {
    /**
     * Creates a new, empty Vector4.
     */
    constructor() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
    }

    /**
     * Get a Vector3 with the x, y and z components of this Vector4.
     */
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

    /**
     * Set this Vector4 components.
     * @param x - The Vector4 x component.
     * @param y - The Vector4 y component.
     * @param z - The Vector4 z component.
     * @param w - The Vector4 w component.
     * @returns Returns this Vector4.
     */
    set(x: number, y: number, z: number, w: number): Vector4 {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
        return this;
    }

    /**
     * Normalize this Vector4 (Set the length of this vector to 1).
     * @returns Returns this Vector4.
     */
    normalize(): Vector4 {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this[0] = x * len;
            this[1] = y * len;
            this[2] = z * len;
            this[3] = w * len;
        }
        return this;
    }

    /**
     * Transform this Vector4 with a Matrix4.
     * @param m - Matrix to transform with.
     * @returns Returns this Vector4.
     */
    transform(m : Matrix4): Vector4 {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        this[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        this[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        this[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        this[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return this;
    }

    /**
     * Get an transformed Vector4 of this Vector4 with a Matrix4.
     * @param m - Matrix to transform with.
     */
    getTransformed(m: Matrix4): Vector4 {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        const out = new Vector4();
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return out;
    }

    /**
     * Calculates the dot product of two Vector4.
     * @param other - The other Vector4 to calculates the dot product.
     */
    dot(other: Vector4): number {
        return this[0] * other[0]
            + this[1] * other[1]
            + this[2] * other[2]
            + this[3] * other[3];
    }

    /**
     * Calculates the length of this Vector4.
     */
    length(): number {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Subtracts Vector4 other from this.
     * @param other - The other Vector4.
     * @returns Returns this Vector4.
     */
    subtract(other: Vector4): Vector4 {
        this[0] -= other[0];
        this[1] -= other[1];
        this[2] -= other[2];
        this[3] -= other[3];
        return this;
    }

    /**
     * Add Vector4 other to this.
     * @param other - The other Vector4.
     * @returns Returns this Vector4.
     */
    add(other: Vector4): Vector4 {
        this[0] += other[0];
        this[1] += other[1];
        this[2] += other[2];
        this[3] += other[3];
        return this;
    }

    /**
     * Negates the components of this Vector4.
     * @returns Returns this Vector4.
     */
    negate(): Vector4 {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = -this[3];
        return this;
    }

    /**
     * Subtract the Vector4 b from the Vector4 a and returns it in a new Vector4.
     * @param a - The Vector4 a.
     * @param b - The Vector4 b to subtract from a.
     * @returns a new Vector4 containg the result of subtraction.
     */
    static subtract(a: Vector4, b: Vector4): Vector4 {
        const out = new Vector4();
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        out[3] = a[3] - b[3];
        return out;
    }

    /**
     * Add the Vector4 a to the Vector4 b and returns it in a new Vector4.
     * @param a - The Vector4 a to add.
     * @param b - The Vector4 b to add.
     * @returns a new Vector4 containg the sum of a and b.
     */
    static add(a: Vector4, b: Vector4): Vector4 {
        const out = new Vector4();
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        out[3] = a[3] + b[3];
        return out;
    }

    /**
     * Create a new Vector4 from the components.
     * @param vx - x component.
     * @param vy - y component.
     * @param vz - z component.
     * @param vw - w component.
     */
    static fromValues(vx: number, vy: number, vz: number, vw: number) : Vector4 {
        const v = new Vector4();
        v[0] = vx;
        v[1] = vy;
        v[2] = vz;
        v[3] = vw;
        return v;
    }
}
