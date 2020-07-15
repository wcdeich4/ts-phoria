import { Vector4, Vector3 } from '../../Math';

export default function averagePolyVertex(
    vertices: number[],
    worldcoords: Vector4[],
): Vector3 {
    let avx = 0;
    let avy = 0;
    let avz = 0;
    vertices.forEach((vertex) => {
        avx += worldcoords[vertex][0];
        avy += worldcoords[vertex][1];
        avz += worldcoords[vertex][2];
    });
    const len = vertices.length;
    return Vector3.fromValues(avx / len, avy / len, avz / len);
}
