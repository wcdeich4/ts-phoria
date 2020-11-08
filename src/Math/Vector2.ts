import Vector3 from './Vector3';
import Vector4 from './Vector4';

/**
 * 2 Dimensional Vector.
 */
export default class Vector2 {
    0: number;
    1: number;

    /**
     * Creates a new, empty Vector2.
     */
    constructor() {
        this[0] = 0;
        this[1] = 0;
    }

    /**
     * Clone this Vector2 to another.
     */
    clone() : Vector2 {
        const out = new Vector2();
        out[0] = this[0];
        out[1] = this[1];
        return out;
    }

    /**
     * Get an Vector3 with the x and y components of this Vector2.
     * @param z - the z Vector3 component.
     */
    toVector3(z?: number) : Vector3 {
        const v = new Vector3();
        v[0] = this[0];
        v[1] = this[1];
        v[2] = z || 0;
        return v;
    }

    /**
     * Get an Vector4 with the x and y components of this Vector2.
     * @param z - the z Vector4 component.
     * @param w - the w Vector4 component.
     */
    toVector4(z?: number, w?: number) : Vector4 {
        const v = new Vector4();
        v[0] = this[0];
        v[1] = this[1];
        v[2] = z || 0;
        v[3] = w || 0;
        return v;
    }

    /**
     * Set this Vector2 components.
     * @param x - The Vector2 x component.
     * @param y - The Vector2 y component.
     * @returns Returns this Vector2.
     */
    set(x: number, y: number): Vector2 {
        this[0] = x;
        this[1] = y;
        return this;
    }

    /**
     * Normalize this Vector2 (Set the length of this vector to 1).
     * @returns Returns this Vector2.
     */
    normalize(): Vector2 {
        const x = this[0];
        const y = this[1];
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this[0] = x * len;
            this[1] = y * len;
        }
        return this;
    }

    /**
     * Calculates the dot product of two Vector2.
     * @param other - The other Vector2 to calculates the dot product.
     */
    dot(other: Vector2): number {
        return this[0] * other[0] + this[1] * other[1];
    }

    /**
     * Calculates the length of this Vector2.
     */
    length(): number {
        const x = this[0];
        const y = this[1];
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Subtracts Vector2 other from this.
     * @param other - The other Vector2.
     * @returns Returns this Vector2.
     */
    subtract(other: Vector2): Vector2 {
        this[0] -= other[0];
        this[1] -= other[1];
        return this;
    }

    /**
     * Add Vector2 other to this.
     * @param other - The other Vector2.
     * @returns Returns this Vector2.
     */
    add(other: Vector2): Vector2 {
        this[0] += other[0];
        this[1] += other[1];
        return this;
    }

    /**
     * Negates the components of this Vector2.
     * @returns Returns this Vector2.
     */
    negate(): Vector2 {
        this[0] = -this[0];
        this[1] = -this[1];
        return this;
    }

    /**
     * Computes the cross product of two Vector2.
     * Note that the cross product must by definition produce a 3D vector.
     * @param other - the other Vector2 to computes the cross product.
     */
    cross(other: Vector2) : Vector3 {
        const z = this[0] * other[1] - this[1] * other[0];
        return Vector3.fromValues(
            0,
            0,
            z,
        );
    }

    /**
     * Scales this Vector2 by a scalar number.
     * @param scalar - Amount to scale the vector by.
     * @returns Returns this Vector2.
     */
    scale(scalar: number) : Vector2 {
        this[0] *= scalar;
        this[1] *= scalar;
        return this;
    }

    /**
     * Adds two Vector2 after scaling the second operand by a scalar value.
     * @param add - The other Vector2 to add.
     * @param scale - The scalar factor.
     * @returns Returns this Vector2.
     */
    scaleAndAdd(add: Vector2, scale: number) : Vector2 {
        this[0] = this[0] + (add[0] * scale);
        this[1] = this[1] + (add[1] * scale);
        return this;
    }

    /**
     * Subtract the Vector2 b from the Vector2 a and returns it in a new Vector2.
     * @param a - The Vector2 a.
     * @param b - The Vector2 b to subtract from a.
     * @returns a new Vector2 containg the result of subtraction.
     */
    static subtract(a: Vector2, b: Vector2): Vector2 {
        const out = new Vector2();
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        return out;
    }

    /**
     * Add the Vector2 a to the Vector2 b and returns it in a new Vector2.
     * @param a - The Vector2 a to add.
     * @param b - The Vector2 b to add.
     * @returns a new Vector2 containg the sum of a and b.
     */
    static add(a: Vector2, b: Vector2): Vector2 {
        const out = new Vector2();
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        return out;
    }

    /**
     * Create a new Vector2 from the components.
     * @param vx - x component.
     * @param vy - y component.
     */
    static fromValues(vx: number, vy: number): Vector2 {
        const v = new Vector2();
        v[0] = vx;
        v[1] = vy;
        return v;
    }
}
