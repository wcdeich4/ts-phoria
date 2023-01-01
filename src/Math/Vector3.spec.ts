import { Randomizer } from './Randomizer';
import Vector3 from './Vector3';

describe('Vector3 Unit Tests', () => {

    it('Vector3 Average', () => {
        const v1 = Vector3.fromValues(Randomizer.getRandomNumberInRange(-100, 100), Randomizer.getRandomNumberInRange(-100, 100), Randomizer.getRandomNumberInRange(-100, 100) );
        const v2 = Vector3.fromValues(Randomizer.getRandomNumberInRange(-100, 100), Randomizer.getRandomNumberInRange(-100, 100), Randomizer.getRandomNumberInRange(-100, 100) );
        const v3 = Vector3.fromValues(Randomizer.getRandomNumberInRange(-100, 100), Randomizer.getRandomNumberInRange(-100, 100), Randomizer.getRandomNumberInRange(-100, 100) );

        const r = Vector3.GetAverage(v1, v2, v3);

        expect(r[0]).toEqual((v1[0] + v2[0] + v3[0])/3 );
        expect(r[1]).toEqual((v1[1] + v2[1] + v3[1])/3 );
        expect(r[2]).toEqual((v1[2] + v2[2] + v3[2])/3 );

    });
  




});