import { Vector3, Vector4, Matrix4 } from '../../Math';
import BaseEntity, { SceneHandler, BeforeSceneHandler } from './BaseEntity';
import { EntityStyle, EntityStyleOptional } from './EntityStyle';
import { Polygon, Edge } from '../Interfaces';
import { calcNormalVector } from '../Utils';

export type RenderHandle = (
    ctx?: CanvasRenderingContext2D,
    coordA?: number,
    coordB?: number,
    w?: number
) => void;

export default class Entity extends BaseEntity {
    style: EntityStyle = {
        color: [128, 128, 128],
        diffuse: 1.0,
        specular: 0,
        drawmode: 'solid',
        shademode: 'lightsource',
        fillmode: 'inflate',
        objectsortmode: 'sorted',
        geometrysortmode: 'automatic',
        linewidth: 1.0,
        linescale: 0.0,
        opacity: 1.0,
        doublesided: false,
        emit: 0.0,
        texture: null,
        sprite: null,
    };

    points: Vector3[] = [];

    edges: Edge[] = [];

    polygons: Polygon[] = [];

    onRenderHandlers: RenderHandle[] = [];

    // buffers
    worldcoords: Array<Vector4> = [];

    cameracoords: Array<Vector4> = [];

    coords: Array<Vector4> = [];

    clip: Uint32Array = new Uint32Array(0);

    averagez = 0;

    textures: HTMLImageElement[] = [];

    constructor() {
        super();
        this.style = Entity.createStyle();
    }

    onRender(fn: RenderHandle) : void {
        if (this.onRenderHandlers === null) {
            this.onRenderHandlers = [];
        }
        this.onRenderHandlers = this.onRenderHandlers.concat(fn);
    }

    generatePolygonNormals() : void {
        if (this.polygons) {
            // calculate normal vectors for face data - and set default colour
            // value if not supplied in the data set
            const { points, polygons } = this;
            const { length } = polygons;
            for (let i = 0; i < length; i += 1) {
                // First calculate normals from 3 points on the poly:
                // Vector 1 = Vertex B - Vertex A
                // Vector 2 = Vertex C - Vertex A
                const { vertices } = polygons[i];
                const x1 = points[vertices[1]][0] - points[vertices[0]][0];
                const y1 = points[vertices[1]][1] - points[vertices[0]][1];
                const z1 = points[vertices[1]][2] - points[vertices[0]][2];
                const x2 = points[vertices[2]][0] - points[vertices[0]][0];
                const y2 = points[vertices[2]][1] - points[vertices[0]][1];
                const z2 = points[vertices[2]][2] - points[vertices[0]][2];
                // save the vec4 normal vector as part of the polygon data structure
                this.polygons[i].normal = calcNormalVector(x1, y1, z1, x2, y2, z2);
            }
        }
    }

    initCoordinateBuffers() : void {
        const len = this.points.length;
        if (this.worldcoords === null || this.worldcoords.length < len) {
            this.worldcoords = new Array<Vector4>(len);
            for (let i = 0; i < len; i += 1) {
                this.worldcoords[i] = new Vector4();
            }
        }
        if (this.cameracoords === null || this.cameracoords.length < len) {
            this.cameracoords = new Array<Vector4>(len);
            for (let i = 0; i < len; i += 1) {
                this.cameracoords[i] = new Vector4();
            }
        }
        if (this.coords === null || this.coords.length < len) {
            this.coords = new Array<Vector4>(len);
            for (let i = 0; i < len; i += 1) {
                this.coords[i] = new Vector4();
            }
        }
        if (this.clip === null || this.clip.length < len) {
            this.clip = new Uint32Array(len);
        }
    }

    getScreenBounds() : {
        minx: number;
        miny: number;
        maxx: number;
        maxy: number; } {
        let minx = 10000;
        let miny = 10000;
        let maxx = -10000;
        let maxy = -10000;
        for (let i = 0; i < this.coords.length; i += 1) {
            const p = this.coords[i];
            if (p[0] < minx) {
                // eslint-disable-next-line prefer-destructuring
                minx = p[0];
            }
            if (p[0] > maxx) {
                // eslint-disable-next-line prefer-destructuring
                maxx = p[0];
            }
            if (p[1] < miny) {
                // eslint-disable-next-line prefer-destructuring
                miny = p[1];
            }
            if (p[1] > maxy) {
                // eslint-disable-next-line prefer-destructuring
                maxy = p[1];
            }
        }
        return {
            minx,
            miny,
            maxx,
            maxy,
        };
    }

    getWorldBounds() : {
        minx: number;
        miny: number;
        maxx: number;
        maxy: number;
        minz: number;
        maxz: number; } {
        let minx = 10000;
        let miny = 10000;
        let minz = 10000;
        let maxx = -10000;
        let maxy = -10000;
        let maxz = -10000;

        for (let i = 0; i < this.worldcoords.length; i += 1) {
            const p = this.worldcoords[i];
            if (p[0] < minx) {
                // eslint-disable-next-line prefer-destructuring
                minx = p[0];
            }
            if (p[0] > maxx) {
                // eslint-disable-next-line prefer-destructuring
                maxx = p[0];
            }
            if (p[1] < miny) {
                // eslint-disable-next-line prefer-destructuring
                miny = p[1];
            }
            if (p[1] > maxy) {
                // eslint-disable-next-line prefer-destructuring
                maxy = p[1];
            }
            if (p[2] < minz) {
                // eslint-disable-next-line prefer-destructuring
                minz = p[2];
            }
            if (p[2] > maxz) {
                // eslint-disable-next-line prefer-destructuring
                maxz = p[2];
            }
        }
        return {
            minx,
            miny,
            maxx,
            maxy,
            minz,
            maxz,
        };
    }

    // TODO: debug?

    static create(desc: {
        id?: string | null;
        matrix?: Matrix4 | null;
        children?: [] | null;
        onBeforeScene?: BeforeSceneHandler | null;
        onScene?: SceneHandler | null;
        disabled?: boolean | null;
        points?: Vector3[] | null;
        polygons?: Polygon[] | null;
        edges?: Edge[] | null;
        style?: EntityStyleOptional | null;
        onRender?: RenderHandle | null;
    }): Entity {
        const e = new Entity();
        if (desc.id) e.id = desc.id;
        if (desc.matrix) e.matrix = desc.matrix;
        if (desc.children) e.children = desc.children;
        if (desc.onBeforeScene) e.onBeforeScene(desc.onBeforeScene);
        if (desc.onScene) e.onScene(desc.onScene);
        if (desc.disabled !== null && desc.disabled !== undefined) {
            e.disabled = desc.disabled;
        }
        if (desc.points) e.points = desc.points;
        if (desc.polygons) e.polygons = desc.polygons;
        if (desc.edges) e.edges = desc.edges;
        if (desc.style) {
            e.style = {
                ...e.style,
                ...desc.style,
            };
        }
        if (desc.onRender) e.onRender(desc.onRender);
        // generate normals - can call generate...() if manually changing points/polys at runtime
        e.generatePolygonNormals();
        // TODO: apply when gouraud shading for software rendering is added
        // e.generateVertexNormals();
        return e;
    }

    static createStyle(s?: EntityStyleOptional) : EntityStyle {
        let style = {
            color: [128, 128, 128],
            diffuse: 1.0,
            specular: 0,
            drawmode: 'solid',
            shademode: 'lightsource',
            fillmode: 'inflate',
            objectsortmode: 'sorted',
            geometrysortmode: 'automatic',
            linewidth: 1.0,
            linescale: 0.0,
            opacity: 1.0,
            doublesided: false,
            emit: 0.0,
            texture: null,
            sprite: null,
        } as EntityStyle;
        if (s) {
            style = {
                ...style,
                ...s,
            };
        }
        return style;
    }
}
