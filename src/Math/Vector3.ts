import Vector4 from './Vector4';
import Vector2 from './Vector2';
import Matrix4 from './Matrix4';

/**
 * This class implements a three dimensional vector.
 */
export default class Vector3 {
    /** The `x` component of the vector. */
    0: number;
    /** The `y` component of the vector. */
    1: number;
    /** The `z` component of the vector. */
    2: number;

    /**
     * Creates a new, empty, Vector3.
     */
    constructor() {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
    }

    /**
     * Clone this Vector3 to another.
     */
    clone() : Vector3 {
        const out = new Vector3();
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        return out;
    }

    /**
     * Get a Vector2 with the `x` and `y` components of this Vector3.
     */
    getVector2() : Vector2 {
        const v = new Vector2();
        const x = this[0];
        const y = this[1];
        v[0] = x;
        v[1] = y;
        return v;
    }

    /**
     * Get an Vector4 with the `x`, `y` and `z` components of this Vector3.
     * @param w - the `w` Vector4 component. If this `w` component is not set, the zero is used.
     */
    toVector4(w?: number) : Vector4 {
        const v = new Vector4();
        v[0] = this[0];
        v[1] = this[1];
        v[2] = this[2];
        v[3] = w || 0;
        return v;
    }

    /**
     * Set this Vector3 components.
     * @param x - The Vector3 `x` component.
     * @param y - The Vector3 `y` component.
     * @param z - The Vector3 `z` component.
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
     * Scales this Vector3 by a scalar number.
     * @param scalar - Amount to scale the vector by.
     * @returns Returns this Vector3.
     */
    scale(scalar: number) : Vector3 {
        this[0] *= scalar;
        this[1] *= scalar;
        this[2] *= scalar;
        return this;
    }

    /**
     * Adds two Vector3 after scaling the second operand by a scalar value.
     * @param add - The other Vector3 to add.
     * @param scale - The scalar factor.
     * @returns Returns this Vector3.
     */
    scaleAndAdd(add: Vector3, scale: number) : Vector3 {
        this[0] = this[0] + (add[0] * scale);
        this[1] = this[1] + (add[1] * scale);
        this[2] = this[2] + (add[2] * scale);
        return this;
    }

    /**
     * Computes the cross product of two Vector3.
     * @param other - The other Vector3 to computes the cross product.
     */
    cross(other: Vector3): Vector3 {
        const ax = this[0];
        const ay = this[1];
        const az = this[2];
        const bx = other[0];
        const by = other[1];
        const bz = other[2];
        return Vector3.fromValues(
            ay * bz - az * by,
            az * bx - ax * bz,
            ax * by - ay * bx,
        );
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
     * @param vx - `x` component.
     * @param vy - `y` component.
     * @param vz - `z` component.
     */
    static fromValues(vx: number, vy: number, vz: number): Vector3 {
        const v = new Vector3();
        v[0] = vx;
        v[1] = vy;
        v[2] = vz;
        return v;
    }

    /**
     * Calculates the euclidian distance between two Vector3.
     * @param a - The first Vector3.
     * @param b - The second Vector3.
     */
    static distance(a : Vector3, b : Vector3) : number {
        const x = b[0] - a[0];
        const y = b[1] - a[1];
        const z = b[2] - a[2];
        return Math.sqrt(x * x + y * y + z * z);
    }
}
