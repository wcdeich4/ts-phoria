import { Vector3, Vector4 } from '../../Math';

export default function calcNormalVector(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
) : Vector4 {
    const nx = (y1 * z2) - (z1 * y2);
    const ny = -((z2 * x1) - (x2 * z1));
    const nz = (x1 * y2) - (y1 * x2);
    // use vec3 here to save a pointless multiply * 0 and add op
    const v = Vector3.fromValues(nx, ny, nz);
    v.normalize();
    return v.toVector4();
}
