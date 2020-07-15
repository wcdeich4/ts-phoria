import { Vector2, Vector3, Vector4 } from "../../Math";
import { Polygon } from "../Interfaces";

export function planeLineIntersection(
    planeNormal: Vector3,
    planePoint: Vector3,
    lineVector: Vector3,
    linePoint: Vector3,
) : Vector3 | null {
    // planeNormal . (plane - planePoint) = 0
    // line = linePoint + lineScalar * lineVector
    // intersect where line = plane, thus
    // planeNormal . (linePoint + lineScalar * lineVector - planePoint) = 0
    // giving: lineScalar = planeNormal . (planePoint - linePoint) / planeNormal . lineVector
    const dotProduct = lineVector.dot(planeNormal);
    // check that click vector is not parallel to polygon
    if (dotProduct !== 0)
    {
        const pointVector = Vector3.subtract(planePoint, linePoint);
        const lineScalar = planeNormal.dot(pointVector) / dotProduct;
        const intersection = linePoint.clone();
        intersection.scaleAndAdd(lineVector, lineScalar);
        return intersection;
    }
    else
    {
        // return null if parallel, as the vector will never intersect the plane
        return null;
    }
}

export function sectionLineIntersect2D(
    p1: Vector2,
    p2: Vector2,
    p: Vector2,
    v: Vector2
) : boolean {
    // get line section's vector
    const s = Vector2.subtract(p2, p1);
    // calculate cross product of line vectors
    var svCross = s.cross(v);
    // if lines are parallel, they will never intersect
    if (svCross[2] === 0) {
        return false;
    }
    // l1 = p1 + t * s
    // l2 = p + u * v
    // where l1 = l2 the lines intersect thus,
    // t = (p x v - p1 x v) / (s x v)
    const t = (p[0] * v[1] - p[1] * v[0] - p1[0] * v[1] + p1[1] * v[0]) / svCross[2];
    // if v's x value is 0, use the other equation to calculate scalar u.
    let u = 0;
    if (v[0] !== 0)
        u = (p1[0] + t * s[0] - p[0]) / v[0];
    else
        u = (p1[1] + t * s[1] - p[1]) / v[1];
    // intersection point
    const ip = p1.clone().scaleAndAdd(s, t);
    // check if intersection is in the section line
    const doesIntersect = { x: false, y: false };
    // only check in positive direction of test vector
    if (u >= 0)
    {
        if (p1[0] > p2[0])
        {
        if (ip[0] <= p1[0] && ip[0] >= p2[0])
            doesIntersect.x = true;
        }
        else
        {
        if (ip[0] >= p1[0] && ip[0] <= p2[0])
            doesIntersect.x = true;
        }

        if (p1[1] > p2[1])
        {
        if (ip[1] <= p1[1] && ip[1] >= p2[1])
            doesIntersect.y = true;
        }
        else
        {
        if (ip[1] >= p1[1] && ip[1] <= p2[1])
            doesIntersect.y = true;
        }
    }
    // return true if it is
    return (doesIntersect.x && doesIntersect.y);
}

export function intersectionInsidePolygon(
    polygon: Polygon,
    points: Vector4[],
    intersection: Vector3,
) : boolean {
    // get absolute values of polygons normal vector
    const absNormal = Vector3.fromValues(
        Math.abs(polygon.worldnormal[0]),
        Math.abs(polygon.worldnormal[1]),
        Math.abs(polygon.worldnormal[2]),
    );
    // intersection counter
    let numIntersects = 0;
    // the vector for the test line, can be any 2D vector
    const testVector = Vector2.fromValues(1, 1);
    // for every vertice of the polygon
    polygon.vertices.forEach((vertex, l) => {
        let point1 : Vector2;
        let point2 : Vector2;
        let intersection2D : Vector2;
        // use orthogonal planes to check if the point is in shape in 2D
        // the component with the highest normal value is dropped
        // as this gives the best approximation of the original shape
        if (absNormal[2] >= absNormal[0] && absNormal[2] >= absNormal[1])
        {
            // drop z coordinates
            point1 = Vector2.fromValues(
                points[polygon.vertices[l]][0],
                points[polygon.vertices[l]][1],
            );
            if (l < polygon.vertices.length - 1) {
                point2 = Vector2.fromValues(
                    points[polygon.vertices[l + 1]][0],
                    points[polygon.vertices[l + 1]][1],
                );
            } else {
                point2 = Vector2.fromValues(
                    points[polygon.vertices[0]][0],
                    points[polygon.vertices[0]][1],
                );
            }
            intersection2D = Vector2.fromValues(intersection[0], intersection[1]);
        } else if (absNormal[1] > absNormal[0]) {
            // drop y coordinates
            point1 = Vector2.fromValues(
                points[polygon.vertices[l]][2],
                points[polygon.vertices[l]][0],
            );
            if (l < polygon.vertices.length - 1) {
                point2 = Vector2.fromValues(
                    points[polygon.vertices[l + 1]][2],
                    points[polygon.vertices[l + 1]][0],
                );
            } else {
                point2 = Vector2.fromValues(
                    points[polygon.vertices[0]][2],
                    points[polygon.vertices[0]][0],
                );
            }
            intersection2D = Vector2.fromValues(intersection[2], intersection[0]);
        } else {
            // drop x coordinates
            point1 = Vector2.fromValues(
                points[polygon.vertices[l]][1],
                points[polygon.vertices[l]][2],
            );
            if (l < polygon.vertices.length - 1) {
                point2 = Vector2.fromValues(
                    points[polygon.vertices[l + 1]][1],
                    points[polygon.vertices[l + 1]][2],
                );
            } else {
                point2 = Vector2.fromValues(
                    points[polygon.vertices[0]][1],
                    points[polygon.vertices[0]][2],
                );
            }
            intersection2D = Vector2.fromValues(intersection[1], intersection[2]);
        }
        if (sectionLineIntersect2D(point1, point2, intersection2D, testVector)) {
            numIntersects++;
        }
    });
    // uneven number of intersects, mean the point is inside the object
    // even number of intersects, means its outside
    return (numIntersects % 2 === 1);
}
