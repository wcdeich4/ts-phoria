import { readFileSync } from 'fs';
import path from 'path';
//import fetch from 'node-fetch';
import { MeshFactory } from '../MeshFactory';

describe('MeshFactory Unit Tests', () => {

    it('importWavefrontOBJFileContentString', () => {
        const filePath = path.resolve(__dirname, '../../TestData/Quad.obj');
        const objFileContent = readFileSync(filePath, 'utf8');
        expect(objFileContent != null).toEqual(true );
        const dataToCreateEntity = MeshFactory.importWavefrontOBJFileContentString(objFileContent);

        expect(dataToCreateEntity.edges.length > 0).toEqual(true);
        console.log('dataToCreateEntity.edges: ' + JSON.stringify(dataToCreateEntity.edges));

        expect(dataToCreateEntity.points.length > 0).toEqual(true);
        console.log('dataToCreateEntity.points: ' + JSON.stringify(dataToCreateEntity.points));

        expect(dataToCreateEntity.polygons.length > 0).toEqual(true);
        console.log('dataToCreateEntity.polygons.: ' + JSON.stringify(dataToCreateEntity.polygons));
    });
  

});