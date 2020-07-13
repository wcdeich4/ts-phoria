import { Vector3 } from '../Math';
// eslint-disable-next-line no-unused-vars
import { Edge, Polygon } from './Interfaces';

function v3(data: {
    x: number;
    y: number;
    z: number;
}) : Vector3 {
    return Vector3.fromValues(data.x, data.y, data.z);
}

export default class MeshFactory {
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
                { vertices: [0, 1, 2, 3] } as Polygon,
                { vertices: [1, 5, 6, 2] } as Polygon,
                { vertices: [5, 4, 7, 6] } as Polygon,
                { vertices: [4, 0, 3, 7] } as Polygon,
                { vertices: [4, 5, 1, 0] } as Polygon,
                { vertices: [3, 2, 6, 7] } as Polygon,
            ],
        };
    }

    static generateTesselatedPlane(
        vsegs : number,
        hsegs: number,
        level: number,
        scale: number,
        generateUVs: boolean,
    ) {
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
                    const p = {
                        vertices: [c - hsegs - 1, c, c - 1, c - hsegs - 2],
                        uvs: undefined,
                    };
                    if (generateUVs) {
                        const uvs = [
                            (1 / hsegs) * j, (1 / vsegs) * (i - 1),
                            (1 / hsegs) * j, (1 / vsegs) * i,
                            (1 / hsegs) * (j - 1), (1 / vsegs) * i,
                            (1 / hsegs) * (j - 1), (1 / vsegs) * (i - 1),
                        ];
                        p.uvs = uvs;
                    }
                    polys.push(p as Polygon);
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
}
