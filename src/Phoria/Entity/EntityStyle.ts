export interface EntityStyle {
    color: number[];
    diffuse: number;
    specular: number;
    drawmode: 'solid' | 'wireframe' | 'point';
    shademode: string;
    fillmode: string;
    objectsortmode: 'sorted' | 'front' | 'back';
    geometrysortmode: string;
    linewidth: number;
    linescale: number;
    opacity: number;
    doublesided: boolean;
    texture: number | null;
    sprite: number | null;
    emit: number;
    compositeOperation?: string;
}

export interface EntityStyleOptional {
    color?: number[];
    diffuse?: number;
    specular?: number;
    drawmode?: 'solid' | 'wireframe' | 'point';
    shademode?: string;
    fillmode?: string;
    objectsortmode?: 'sorted' | 'front' | 'back';
    geometrysortmode?: string;
    linewidth?: number;
    linescale?: number;
    opacity?: number;
    doublesided?: boolean;
    texture?: number | null;
    sprite?: number | null;
    emit?: number;
    compositeOperation?: string;
}
