// eslint-disable-next-line no-unused-vars
import { Polygon, Edge } from '../Interfaces';
// eslint-disable-next-line no-unused-vars
import { Vector4 } from '../../Math';

export function sortPolygons(polygons : Polygon[], worldcoords: Vector4[]) {
    polygons.forEach((polygon) => {
        const poly = polygon;
        const { vertices } = poly;
        if (vertices.length === 3) {
            poly.avz = (worldcoords[vertices[0]][2]
                + worldcoords[vertices[1]][2]
                + worldcoords[vertices[2]][2]) * 0.333333;
        } else {
            poly.avz = (worldcoords[vertices[0]][2]
                + worldcoords[vertices[1]][2]
                + worldcoords[vertices[2]][2]
                + worldcoords[vertices[3]][2]) * 0.25;
        }
    });
    polygons.sort((a, b) => {
        if (a.avz < b.avz) {
            return -1;
        }
        return 1;
    });
}

export function sortEdges(edges: Edge[], coords: Vector4[]) {
    edges.forEach((edge, index) => {
        const e = edge;
        e.avz = (coords[edges[index].a][2] + coords[edges[index].b][2]) * 0.5;
    });
    edges.sort((a, b) => {
        if (a.avz < b.avz) {
            return -1;
        }
        return 1;
    });
}

const qSort = (collectionA: Vector4[], collectionB: Vector4[], start: number, end: number) => {
    const c = collectionA;
    const a = collectionB;
    // We need our own sort routine as we need to swap items within two lists during the sorting, as
    // they must be maintained in lock-step or the lighting processing (using matching worldcoord indexes)
    // will produce incorrect results
    if (start < end) {
        // eslint-disable-next-line no-bitwise
        const pivotIndex = (start + end) >> 1;
        const pivotValue = a[pivotIndex][2];
        let pivotIndexNew = start;
        let tmp = a[pivotIndex];
        a[pivotIndex] = a[end];
        a[end] = tmp;
        tmp = c[pivotIndex];
        c[pivotIndex] = c[end];
        c[end] = tmp;
        for (let i = start; i < end; i += 1) {
            if (a[i][2] > pivotValue) {
                tmp = c[i];
                c[i] = c[pivotIndexNew];
                c[pivotIndexNew] = tmp;
                tmp = a[i];
                a[i] = a[pivotIndexNew];
                a[pivotIndexNew] = tmp;
                pivotIndexNew += 1;
            }
        }
        tmp = c[pivotIndexNew];
        c[pivotIndexNew] = c[end];
        c[end] = tmp;
        tmp = a[pivotIndexNew];
        a[pivotIndexNew] = a[end];
        a[end] = tmp;
        qSort(c, a, start, pivotIndexNew - 1);
        qSort(c, a, pivotIndexNew + 1, end);
    }
};

export function sortPoints(coords: Vector4[], worldcoords: Vector4[]) {
    qSort(worldcoords, coords, 0, coords.length - 1);
}
