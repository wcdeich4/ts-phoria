export interface EntityStyle {
    color: [number, number, number];
    diffuse: number;
    specular: number;
    drawmode: 'solid' | 'wireframe' | 'point';
    shademode: 'plain' | 'lightsource' | 'sprite' | 'callback';
    fillmode: 'fill' | 'filltwice' | 'inflate' | 'fillstroke' | 'hiddenline';
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
    color?: [number, number, number];
    diffuse?: number;
    specular?: number;
    drawmode?: 'solid' | 'wireframe' | 'point';
    shademode?: 'plain' | 'lightsource' | 'sprite' | 'callback';
    fillmode?: 'fill' | 'filltwice' | 'inflate' | 'fillstroke' | 'hiddenline';
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
