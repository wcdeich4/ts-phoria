import { Vector3 } from '../Math';
import { Edge, Polygon } from './Interfaces';

function v3(data: {
    x: number;
    y: number;
    z: number;
}) : Vector3 {
    return Vector3.fromValues(data.x, data.y, data.z);
}

function e(data: {
    a: number;
    b: number;
}) : Edge {
    return {
        a: data.a,
        b: data.b,
        avz: 0,
    };
}

function p(data: {
    vertices: number[];
}): Polygon {
    return {
        vertices: data.vertices,
    } as Polygon;
}

export class MeshFactory {
    constructor() {
        throw new Error('MeshFactory can not be instantiated');
    }

    static generateUnitCube(scale: number) : {
        points: Vector3[];
        edges: Edge[];
        polygons: Polygon[];
    } {
        const s = scale || 1;
        return {
            points: [
                v3({ x: -1 * s, y: 1 * s, z: -1 * s }),
                v3({ x: 1 * s, y: 1 * s, z: -1 * s }),
                v3({ x: 1 * s, y: -1 * s, z: -1 * s }),
                v3({ x: -1 * s, y: -1 * s, z: -1 * s }),
                v3({ x: -1 * s, y: 1 * s, z: 1 * s }),
                v3({ x: 1 * s, y: 1 * s, z: 1 * s }),
                v3({ x: 1 * s, y: -1 * s, z: 1 * s }),
                v3({ x: -1 * s, y: -1 * s, z: 1 * s }),
            ],
            edges: [
                { a: 0, b: 1, avz: 0 },
                { a: 1, b: 2, avz: 0 },
                { a: 2, b: 3, avz: 0 },
                { a: 3, b: 0, avz: 0 },
                { a: 4, b: 5, avz: 0 },
                { a: 5, b: 6, avz: 0 },
                { a: 6, b: 7, avz: 0 },
                { a: 7, b: 4, avz: 0 },
                { a: 0, b: 4, avz: 0 },
                { a: 1, b: 5, avz: 0 },
                { a: 2, b: 6, avz: 0 },
                { a: 3, b: 7, avz: 0 },
            ],
            polygons: [
                p({ vertices: [0, 1, 2, 3] }),
                p({ vertices: [1, 5, 6, 2] }),
                p({ vertices: [5, 4, 7, 6] }),
                p({ vertices: [4, 0, 3, 7] }),
                p({ vertices: [4, 5, 1, 0] }),
                p({ vertices: [3, 2, 6, 7] }),
            ],
        };
    }

    static generateTesselatedPlane(
        vsegs : number,
        hsegs: number,
        level: number,
        scale: number,
        generateUVs: boolean,
    ) : {
        points: Vector3[];
        edges: Edge[];
        polygons: Polygon[];
    } {
        const points: Vector3[] = [];
        const edges: Edge[] = [];
        const polys: Polygon[] = [];
        const hinc = scale / hsegs;
        const vinc = scale / vsegs;
        let c = 0;
        let x = 0;
        let y = scale / 2;
        for (let i = 0; i <= vsegs; i += 1) {
            x = -scale / 2;
            for (let j = 0; j <= hsegs; j += 1) {
                // generate a row of points
                points.push(v3({
                    x,
                    y: 0,
                    z: y,
                }));
                // edges
                if (j !== 0) {
                    edges.push({
                        a: c,
                        b: c - 1,
                        avz: 0,
                    });
                }
                if (i !== 0) {
                    edges.push({
                        a: c,
                        b: c - hsegs - 1,
                        avz: 0,
                    });
                }
                if (i !== 0 && j !== 0) {
                    // generate quad
                    const pq = p({
                        vertices: [c - hsegs - 1, c, c - 1, c - hsegs - 2],
                    });
                    if (generateUVs) {
                        const uvs = [
                            (1 / hsegs) * j, (1 / vsegs) * (i - 1),
                            (1 / hsegs) * j, (1 / vsegs) * i,
                            (1 / hsegs) * (j - 1), (1 / vsegs) * i,
                            (1 / hsegs) * (j - 1), (1 / vsegs) * (i - 1),
                        ];
                        pq.uvs = uvs;
                    }
                    polys.push(pq);
                }
                x += hinc;
                c += 1;
            }
            y -= vinc;
        }
        return {
            points,
            edges,
            polygons: polys,
        };
    }

    static generatePyramid(scale?: number) : {
        points: Vector3[];
        edges: Edge[];
        polygons: Polygon[];
    } {
        const s = scale || 1;
        return {
            points: [
                v3({ x: -1 * s, y: 0, z: -1 * s }),
                v3({ x: -1 * s, y: 0, z: 1 * s }),
                v3({ x: 1 * s, y: 0, z: 1 * s }),
                v3({ x: 1 * s, y: 0 * s, z: -1 * s }),
                v3({ x: 0, y: 1.5 * s, z: 0 }),
            ],
            edges: [
                e({ a: 0, b: 1 }),
                e({ a: 1, b: 2 }),
                e({ a: 2, b: 3 }),
                e({ a: 3, b: 0 }),
                e({ a: 0, b: 4 }),
                e({ a: 1, b: 4 }),
                e({ a: 2, b: 4 }),
                e({ a: 3, b: 4 }),
            ],
            polygons: [
                p({ vertices: [0, 1, 4] }),
                p({ vertices: [1, 2, 4] }),
                p({ vertices: [2, 3, 4] }),
                p({ vertices: [3, 0, 4] }),
                p({ vertices: [3, 2, 1, 0] }),
            ],
        };
    }

    static generateSphere(
        scale: number,
        lats: number,
        longs: number,
        generateUVs: boolean,
    ): {
        points: Vector3[],
        edges: Edge[],
        polygons: Polygon[],
    } {
        const points: Vector3[] = [];
        const edges: Edge[] = [];
        const polys: Polygon[] = [];
        const uvs: {
            u: number;
            v: number;
        }[] = [];

        for (let latNumber = 0; latNumber <= lats; latNumber += 1) {
            for (let longNumber = 0; longNumber <= longs; longNumber += 1) {
                const theta = (latNumber * Math.PI) / lats;
                const phi = (longNumber * 2 * Math.PI) / longs;
                const sinTheta = Math.sin(theta);
                const sinPhi = Math.sin(phi);
                const cosTheta = Math.cos(theta);
                const cosPhi = Math.cos(phi);
                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;
                if (generateUVs) {
                    const u = longNumber / longs;
                    const v = latNumber / lats;
                    uvs.push({ u, v });
                }
                points.push(v3({
                    x: scale * x,
                    y: scale * y,
                    z: scale * z,
                }));
            }
        }

        for (let latNumber = 0; latNumber < lats; latNumber += 1) {
            for (let longNumber = 0; longNumber < longs; longNumber += 1) {
                const first = (latNumber * (longs + 1)) + longNumber;
                const second = first + longs + 1;
                if (latNumber === 0) {
                    // top triangle
                    const pol = p({ vertices: [first + 1, second + 1, second] });
                    if (generateUVs) {
                        pol.uvs = [
                            uvs[first + 1].u,
                            uvs[first + 1].v,
                            uvs[second + 1].u,
                            uvs[second + 1].v,
                            uvs[second].u,
                            uvs[second].v,
                        ];
                    }
                    polys.push(pol);
                    edges.push(e({ a: first, b: second }));
                } else if (latNumber === lats - 1) {
                    // bottom triangle
                    const pol = p({ vertices: [first + 1, second, first] });
                    if (generateUVs) {
                        pol.uvs = [
                            uvs[first + 1].u,
                            uvs[first + 1].v,
                            uvs[second].u,
                            uvs[second].v,
                            uvs[first].u,
                            uvs[first].v,
                        ];
                    }
                    polys.push(pol);
                    edges.push(e({ a: first, b: second }));
                } else {
                    // quad strip
                    const pol = p({
                        vertices: [first + 1, second + 1, second, first],
                    });
                    if (generateUVs) {
                        pol.uvs = [
                            uvs[first + 1].u,
                            uvs[first + 1].v,
                            uvs[second + 1].u,
                            uvs[second + 1].v,
                            uvs[second].u,
                            uvs[second].v,
                            uvs[first].u,
                            uvs[first].v,
                        ];
                    }
                    polys.push(pol);
                    edges.push(e({ a: first, b: second }));
                    edges.push(e({ a: second, b: second + 1 }));
                }
            }
        }
        return {
            points,
            edges,
            polygons: polys,
        };
    }

    static generateIcosahedron(scale?: number) : {
        points: Vector3[];
        edges: Edge[];
        polygons: Polygon[];
    } {
        // Generator code from "Tessellation of sphere" http://student.ulb.ac.be/~claugero/sphere/index.html
        const s = scale || 1;
        const t = (1 + Math.sqrt(5)) / 2;
        const tau = (t / Math.sqrt(1 + t * t)) * s;
        const one = (1 / Math.sqrt(1 + t * t)) * s;
        return {
            points: [
                v3({ x: tau, y: one, z: 0 }),
                v3({ x: -tau, y: one, z: 0 }),
                v3({ x: -tau, y: -one, z: 0 }),
                v3({ x: tau, y: -one, z: 0 }),
                v3({ x: one, y: 0, z: tau }),
                v3({ x: one, y: 0, z: -tau }),
                v3({ x: -one, y: 0, z: -tau }),
                v3({ x: -one, y: 0, z: tau }),
                v3({ x: 0, y: tau, z: one }),
                v3({ x: 0, y: -tau, z: one }),
                v3({ x: 0, y: -tau, z: -one }),
                v3({ x: 0, y: tau, z: -one }),
            ],
            edges: [
                e({ a: 4, b: 8 }),
                e({ a: 8, b: 7 }),
                e({ a: 7, b: 4 }),
                e({ a: 7, b: 9 }),
                e({ a: 9, b: 4 }),
                e({ a: 5, b: 6 }),
                e({ a: 6, b: 11 }),
                e({ a: 11, b: 5 }),
                e({ a: 5, b: 10 }),
                e({ a: 10, b: 6 }),
                e({ a: 0, b: 4 }),
                e({ a: 4, b: 3 }),
                e({ a: 3, b: 0 }),
                e({ a: 3, b: 5 }),
                e({ a: 5, b: 0 }),
                e({ a: 2, b: 7 }),
                e({ a: 7, b: 1 }),
                e({ a: 1, b: 2 }),
                e({ a: 1, b: 6 }),
                e({ a: 6, b: 2 }),
                e({ a: 8, b: 0 }),
                e({ a: 0, b: 11 }),
                e({ a: 11, b: 8 }),
                e({ a: 11, b: 1 }),
                e({ a: 1, b: 8 }),
                e({ a: 9, b: 10 }),
                e({ a: 10, b: 3 }),
                e({ a: 3, b: 9 }),
                e({ a: 9, b: 2 }),
                e({ a: 2, b: 10 }),
            ],
            polygons: [
                p({ vertices: [4, 8, 7] }),
                p({ vertices: [4, 7, 9] }),
                p({ vertices: [5, 6, 11] }),
                p({ vertices: [5, 10, 6] }),
                p({ vertices: [0, 4, 3] }),
                p({ vertices: [0, 3, 5] }),
                p({ vertices: [2, 7, 1] }),
                p({ vertices: [2, 1, 6] }),
                p({ vertices: [8, 0, 11] }),
                p({ vertices: [8, 11, 1] }),
                p({ vertices: [9, 10, 3] }),
                p({ vertices: [9, 2, 10] }),
                p({ vertices: [8, 4, 0] }),
                p({ vertices: [11, 0, 5] }),
                p({ vertices: [4, 9, 3] }),
                p({ vertices: [5, 3, 10] }),
                p({ vertices: [7, 8, 1] }),
                p({ vertices: [6, 1, 11] }),
                p({ vertices: [7, 2, 9] }),
                p({ vertices: [6, 10, 2] }),
            ],
        };
    }

    static subdivide(v: Vector3[], polygons: Polygon[]) : {
        points: Vector3[];
        polygons: Polygon[];
    } {
        const vertices: Vector3[] = [];
        const polys: Polygon[] = [];

        const fnSubDivide = (v1: Vector3, v2: Vector3, v3: Vector3) => {
            const v12 = Vector3.fromValues(
                v1[0] + v2[0],
                v1[1] + v2[1],
                v1[2] + v2[2],
            );
            const v23 = Vector3.fromValues(
                v2[0] + v3[0],
                v2[1] + v3[1],
                v2[2] + v3[2],
            );
            const v31 = Vector3.fromValues(
                v3[0] + v1[0],
                v3[1] + v1[1],
                v3[2] + v1[2],
            );
            v12.normalize();
            v23.normalize();
            v31.normalize();
            const pn = vertices.length;
            vertices.push(v1, v2, v3, v12, v23, v31);
            polys.push(p({ vertices: [pn + 0, pn + 3, pn + 5] }));
            polys.push(p({ vertices: [pn + 1, pn + 4, pn + 3] }));
            polys.push(p({ vertices: [pn + 2, pn + 5, pn + 4] }));
            polys.push(p({ vertices: [pn + 3, pn + 4, pn + 5] }));
        };
        for (let i = 0; i < polygons.length; i += 1) {
            const vs = polygons[i].vertices;
            if (vs.length === 3) {
                fnSubDivide(v[vs[0]], v[vs[1]], v[vs[2]]);
            } else if (vs.length === 4) {
                fnSubDivide(v[vs[0]], v[vs[1]], v[vs[2]]);
                fnSubDivide(v[vs[2]], v[vs[3]], v[vs[0]]);
            }
        }
        return {
            points: vertices,
            polygons: polys,
        };
    }
}
