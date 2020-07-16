import { EPSILON } from './constants';
import Vector3 from './Vector3';

/**
 * 4x4 Matrix
 */
export default class Matrix4 {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
    13: number;
    14: number;
    15: number;

    /**
     * Creates a new identity Matrix4.
     */
    constructor() {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;

        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;

        this[8] = 0;
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;

        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
    }

    /**
     * Creates a new Matrix4 initialized with values from an existing Matrix4.
     */
    clone() : Matrix4 {
        const out = new Matrix4();

        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        out[4] = this[4];
        out[5] = this[5];
        out[6] = this[6];
        out[9] = this[9];
        out[7] = this[7];
        out[8] = this[8];
        out[10] = this[10];
        out[11] = this[11];
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];

        return out;
    }

    /**
     * Copy the values from this Matrix4 to other Matrix4.
     * @param other - The other matrix to copy the values to it.
     */
    copy(other: Matrix4): Matrix4 {
        const out = other;
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        out[4] = this[4];
        out[5] = this[5];
        out[6] = this[6];
        out[9] = this[9];
        out[7] = this[7];
        out[8] = this[8];
        out[10] = this[10];
        out[11] = this[11];
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }

    /**
     * Set this Matrix4 to the identity Matrix.
     * @returns Returns this Matrix.
     */
    identity(): Matrix4 {
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 1;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = 1;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 1;
        return this;
    }

    /**
     * Calculates the determinant of this Matrix4.
     */
    determinant(): number {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        const a30 = this[12];
        const a31 = this[13];
        const a32 = this[14];
        const a33 = this[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /**
     * Multiplies this Matrix4 by other Matrix4.
     * @param b - The other Matrix.
     * @returns Returns this Matrix.
     */
    multiply(b: Matrix4): Matrix4 {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        const a30 = this[12];
        const a31 = this[13];
        const a32 = this[14];
        const a33 = this[15];
        // Cache only the current line of the second matrix
        let b0 = b[0];
        let b1 = b[1];
        let b2 = b[2];
        let b3 = b[3];
        this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }

    /**
     * Transpose the values of this Matrix4.
     * @returns Returns this Matrix.
     */
    transpose(): Matrix4 {
        // eslint-disable-next-line prefer-destructuring
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a12 = this[6];
        const a13 = this[7];
        const a23 = this[11];
        this[1] = this[4];
        this[2] = this[8];
        this[3] = this[12];
        this[4] = a01;
        this[6] = this[9];
        this[7] = this[13];
        this[8] = a02;
        this[9] = a12;
        this[11] = this[14];
        this[12] = a03;
        this[13] = a13;
        this[14] = a23;
        return this;
    }

    /**
     * Translate a Matrix4 by the given vector.
     * @param v - The vector to translate by.
     * @returns Returns this Matrix.
     */
    translate(v: Vector3): Matrix4 {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        this[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
        this[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
        this[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
        this[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
        return this;
    }

    /**
     * Scales the Matrix4 by the dimensions in the given Vector3.
     * @param v - Vector3 with the dimensions to scale the Matrix4 by.
     * @returns Returns this Matrix.
     */
    scale(v: Vector3): Matrix4 {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        this[0] *= x;
        this[1] *= x;
        this[2] *= x;
        this[3] *= x;
        this[4] *= y;
        this[5] *= y;
        this[6] *= y;
        this[7] *= y;
        this[8] *= z;
        this[9] *= z;
        this[10] *= z;
        this[11] *= z;
        return this;
    }

    /**
     * Rotates a Matrix4 by the given angle around the given axis.
     * @param rad - the angle to rotate the matrix by.
     * @param axis - the axis to rotate around.
     * @returns Returns this Matrix.
     */
    rotate(rad: number, axis: Vector3): Matrix4 {
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        if (Math.abs(len) < EPSILON) {
            return this;
        }
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const t = 1 - c;
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c;
        const b01 = y * x * t + z * s;
        const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s;
        const b11 = y * y * t + c;
        const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s;
        const b21 = y * z * t - x * s;
        const b22 = z * z * t + c;
        // Perform rotation-specific matrix multiplication
        this[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this[11] = a03 * b20 + a13 * b21 + a23 * b22;
        return this;
    }

    /**
     * Rotates a Matrix4 by the given angle around the X axis.
     * @param rad - the angle to rotate the matrix by.
     * @returns Returns this Matrix.
     */
    rotateX(rad: number): Matrix4 {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        // Perform axis-specific matrix multiplication
        this[4] = a10 * c + a20 * s;
        this[5] = a11 * c + a21 * s;
        this[6] = a12 * c + a22 * s;
        this[7] = a13 * c + a23 * s;
        this[8] = a20 * c - a10 * s;
        this[9] = a21 * c - a11 * s;
        this[10] = a22 * c - a12 * s;
        this[11] = a23 * c - a13 * s;
        return this;
    }

    /**
     * Rotates a Matrix4 by the given angle around the Y axis.
     * @param rad - the angle to rotate the matrix by.
     * @returns Returns this Matrix.
     */
    rotateY(rad: number): Matrix4 {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        // Perform axis-specific matrix multiplication
        this[0] = a00 * c - a20 * s;
        this[1] = a01 * c - a21 * s;
        this[2] = a02 * c - a22 * s;
        this[3] = a03 * c - a23 * s;
        this[8] = a00 * s + a20 * c;
        this[9] = a01 * s + a21 * c;
        this[10] = a02 * s + a22 * c;
        this[11] = a03 * s + a23 * c;
        return this;
    }

    /**
     * Rotates a Matrix4 by the given angle around the Z axis.
     * @param rad - the angle to rotate the matrix by.
     * @returns Returns this Matrix.
     */
    rotateZ(rad: number): Matrix4 {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        // Perform axis-specific matrix multiplication
        this[0] = a00 * c + a10 * s;
        this[1] = a01 * c + a11 * s;
        this[2] = a02 * c + a12 * s;
        this[3] = a03 * c + a13 * s;
        this[4] = a10 * c - a00 * s;
        this[5] = a11 * c - a01 * s;
        this[6] = a12 * c - a02 * s;
        this[7] = a13 * c - a03 * s;
        return this;
    }

    /**
     * Inverts this Matrix4.
     * @returns Returns this Matrix.
     */
    invert(): Matrix4 {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];
        const a30 = this[12];
        const a31 = this[13];
        const a32 = this[14];
        const a33 = this[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b02 = a00 * a13 - a03 * a10;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return this;
        }
        det = 1.0 / det;
        this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return this;
    }

    /**
     * Gets the inverse Matrix4 of this Matrix4.
     */
    getInverted(): Matrix4 {
        const i = this.clone();
        i.invert();
        return i;
    }

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * @param eye - Position of the viewer.
     * @param center - Point the viewer is looking at.
     * @param up - Vector3 pointing up.
     * @returns Returns this Matrix.
     */
    lookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
        const eyex = eye[0];
        const eyey = eye[1];
        const eyez = eye[2];
        const upx = up[0];
        const upy = up[1];
        const upz = up[2];
        const centerx = center[0];
        const centery = center[1];
        const centerz = center[2];

        if (Math.abs(eyex - centerx) < EPSILON
            && Math.abs(eyey - centery) < EPSILON
            && Math.abs(eyez - centerz) < EPSILON) {
            this.identity();
            return this;
        }
        let z0 = eyex - centerx;
        let z1 = eyey - centery;
        let z2 = eyez - centerz;
        let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        let x0 = upy * z2 - upz * z1;
        let x1 = upz * z0 - upx * z2;
        let x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        let y0 = z1 * x2 - z2 * x1;
        let y1 = z2 * x0 - z0 * x2;
        let y2 = z0 * x1 - z1 * x0;
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        this[0] = x0;
        this[1] = y0;
        this[2] = z0;
        this[3] = 0;
        this[4] = x1;
        this[5] = y1;
        this[6] = z1;
        this[7] = 0;
        this[8] = x2;
        this[9] = y2;
        this[10] = z2;
        this[11] = 0;
        this[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        this[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        this[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        this[15] = 1;
        return this;
    }

    /**
     * Generates a perspective projection matrix with the given bounds.
     * @param fovy - Vertical field of view in radians.
     * @param aspect - Aspect ratio. typically viewport width/height.
     * @param near - Near bound of the frustum.
     * @param far - Far bound of the frustum.
     * @returns Returns this Matrix.
     */
    perspective(
        fovy: number,
        aspect: number,
        near: number,
        far: number,
    ): Matrix4 {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);
        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = (far + near) * nf;
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[14] = (2 * far * near) * nf;
        this[15] = 0;
        return this;
    }

    /**
     * Creates a rotation matrix from the given yaw (heading), pitch (elevation) and roll (bank) Euler angles.
     * @param yaw - the yaw/heading angle in radians.
     * @param pitch - the pitch/elevation angle in radians.
     * @param roll - the roll/bank angle in radians.
     */
    static fromYPR(yaw: number, pitch: number, roll: number): Matrix4 {
        const out = new Matrix4();
        const angles0 = Math.sin(roll);
        const angles1 = Math.cos(roll);
        const angles2 = Math.sin(pitch);
        const angles3 = Math.cos(pitch);
        const angles4 = Math.sin(yaw);
        const angles5 = Math.cos(yaw);
        out[0] = angles5 * angles1;
        out[4] = -(angles5 * angles0);
        out[8] = angles4;
        out[1] = (angles2 * angles4 * angles1) + (angles3 * angles0);
        out[5] = (angles3 * angles1) - (angles2 * angles4 * angles0);
        out[9] = -(angles2 * angles5);
        out[2] = (angles2 * angles0) - (angles3 * angles4 * angles1);
        out[6] = (angles2 * angles1) + (angles3 * angles4 * angles0);
        out[10] = angles3 * angles5;
        out[3] = 0;
        out[7] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }
}
