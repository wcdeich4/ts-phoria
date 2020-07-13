/* eslint-disable prefer-destructuring */
import Vector4 from './Vector4';
// eslint-disable-next-line no-unused-vars
import Matrix4 from './Matrix4';

/**
 * 3 Dimensional Vector.
 */
export default class Vector3 {
    /**
     * Creates a new, empty Vector3.
     */
    constructor() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
    }

    /**
     * Get an Vector4 with the x, y and z components of this Vector3.
     * @param w - the w Vector4 component.
     */
    toVector4(w?: number) {
        const v = new Vector4();
        v[0] = this[0];
        v[1] = this[1];
        v[2] = this[2];
        v[3] = w || 0;
        return v;
    }

    /**
     * Set this Vector3 components.
     * @param x - The Vector3 x component.
     * @param y - The Vector3 y component.
     * @param z - The Vector3 z component.
     * @returns Returns this Vector3.
     */
    set(x: number, y: number, z: number): Vector3 {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        return this;
    }

    /**
     * Normalize this Vector3 (Set the length of this vector to 1).
     * @returns Returns this Vector3.
     */
    normalize(): Vector3 {
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
        return this;
    }

    /**
     * Transform this Vector3 with a Matrix4.
     * 4th vector component is implicitly '1'.
     * @param m - Matrix to transform with.
     * @returns Returns this Vector3.
     */
    transform(m: Matrix4): Vector3 {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        this[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
        this[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
        this[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        return this;
    }

    /**
     * Get an transformed Vector3 of this Vector3 with a Matrix4.
     * @param m - Matrix to transform with.
     */
    getTransformed(m: Matrix4): Vector3 {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const out = new Vector3();
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        return out;
    }

    /**
     * Calculates the dot product of two Vector3.
     * @param other - The other Vector3 to calculates the dot product.
     */
    dot(other: Vector3): number {
        return this[0] * other[0] + this[1] * other[1] + this[2] * other[2];
    }

    /**
     * Calculates the length of this Vector3.
     */
    length(): number {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Subtracts Vector3 other from this.
     * @param other - The other Vector3.
     * @returns Returns this Vector3.
     */
    subtract(other: Vector3): Vector3 {
        this[0] -= other[0];
        this[1] -= other[1];
        this[2] -= other[2];
        return this;
    }

    /**
     * Add Vector3 other to this.
     * @param other - The other Vector3.
     * @returns Returns this Vector3.
     */
    add(other: Vector3): Vector3 {
        this[0] += other[0];
        this[1] += other[1];
        this[2] += other[2];
        return this;
    }

    /**
     * Negates the components of this Vector3.
     * @returns Returns this Vector3.
     */
    negate(): Vector3 {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        return this;
    }

    /**
     * Subtract the Vector3 b from the Vector3 a and returns it in a new Vector3.
     * @param a - The Vector3 a.
     * @param b - The Vector3 b to subtract from a.
     * @returns a new Vector3 containg the result of subtraction.
     */
    static subtract(a: Vector3, b: Vector3): Vector3 {
        const out = new Vector3();
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
    }

    /**
     * Add the Vector3 a to the Vector3 b and returns it in a new Vector3.
     * @param a - The Vector3 a to add.
     * @param b - The Vector3 b to add.
     * @returns a new Vector3 containg the sum of a and b.
     */
    static add(a: Vector3, b: Vector3 | Vector4): Vector3 {
        const out = new Vector3();
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        return out;
    }

    /**
     * Create a new Vector3 from the components.
     * @param vx - x component.
     * @param vy - y component.
     * @param vz - z component.
     */
    static fromValues(vx: number, vy: number, vz: number): Vector3 {
        const v = new Vector3();
        v[0] = vx;
        v[1] = vy;
        v[2] = vz;
        return v;
    }
}
