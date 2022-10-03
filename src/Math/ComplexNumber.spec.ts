import { ComplexNumber } from './ComplexNumber';
import {Randomizer} from './Randomizer'

describe('ComplexNumber', () => {

    it('Rectanular Complex Number Clone', () => {
        const z = new ComplexNumber(5, -7);
        let w: ComplexNumber;
        w = z.clone() as ComplexNumber;
        expect(z.equals(w)).toEqual(true);
    });
  
    it('Complex Number e to i theta', () => {
        const theta = Math.PI / 3;
        const z = ComplexNumber.eToITheta(theta);
        expect(z.realPart === Math.cos(theta));
        expect(z.imaginaryPart === Math.sin(theta));
    });

    it('Complex Number Add', () => {
        const r1 = -3;
        const i1 = 99;
        const first = new ComplexNumber(r1, i1);
        const second= new ComplexNumber(88, -104);
        const sum = ComplexNumber.add(first, second);
        expect(sum.realPart === (r1 + second.realPart));
        expect(sum.imaginaryPart === (i1 + second.imaginaryPart));
    });

    it('Complex Number Subtract', () => {
        const r1 = -3;
        const i1 = 99;
        const first = new ComplexNumber(r1, i1);
        const second= new ComplexNumber(88, -104);
        const diff = ComplexNumber.subtract(first, second);
        expect(diff.realPart === (r1 - second.realPart));
        expect(diff.imaginaryPart === (i1 - second.imaginaryPart));
    });

    it('Complex Numbers multiply1', () => {
        const r1 = Randomizer.getRandomNumberInRange(-1000, 1000);
        const i1 = Randomizer.getRandomNumberInRange(-1000, 1000);
        const r2 = Randomizer.getRandomNumberInRange(-1000, 1000);
        const i2 = Randomizer.getRandomNumberInRange(-1000, 1000);
        let c1 = new ComplexNumber(r1,i1);
        let c2 = new ComplexNumber(r2,i2);
        let c3 = ComplexNumber.multiplyByComplexNumber(c1, c2);
        expect(c3.realPart === r1*r2 - i1*i2);
        expect(c3.imaginaryPart === r1*i2 + r2*i1);        
    });

    it('Complex Number GetAngle #0', () => {
        let c = new ComplexNumber(0,0);
        let angle = c.getAngle();
        expect(angle == 0)
    }); 

    it('Complex Number GetAngle #1', () => {
        let c = new ComplexNumber(0,1);
        let angle = c.getAngle();
        expect(angle == Math.PI / 2)
    }); 

    it('Complex Number GetAngle #2', () => {
        let c = new ComplexNumber(-1,0);
        let angle = c.getAngle();
        expect(angle == Math.PI)
    }); 

    it('Complex Number GetAngle #3', () => {
        let c = new ComplexNumber(0, -1);
        let angle = c.getAngle();
        expect(angle == -Math.PI / 2)
    }); 

    it('Complex Number GetAngle #4', () => {
        let c = new ComplexNumber(1,1);
        let angle = c.getAngle();
        expect(angle == Math.PI / 4)

    }); 

    it('Complex Number GetAngle #5', () => {
        let c = new ComplexNumber(-1,1);
        let angle = c.getAngle();
        expect(angle == 3 * Math.PI / 4)
    }); 

    it('Complex Number GetAngle #6', () => {
        let c = new ComplexNumber(-1,-1);
        let angle = c.getAngle();
        expect(angle == 5 * Math.PI / 4)
    }); 

    it('Complex Number GetAngle #7', () => {
        let c = new ComplexNumber(1,-1);
        let angle = c.getAngle();
        expect(angle == -Math.PI / 4)

    }); 

    it('Complex Number GetRadius', () => {
        let c = new ComplexNumber(3,7);
        let r = c.getRadius();
        expect(r == Math.sqrt(3*3 + 7*7));

    }); 


    it('Complex Number Raise To Power #1', () => {
        const r1 = Randomizer.getRandomNumberInRange(-10000, 10000);
        const i1 = Randomizer.getRandomNumberInRange(-10000, 10000);
        const c1 = new ComplexNumber(r1, i1);
        const power = 11;
        let expectedResult = c1.clone();
        let i = 1;
        while (i < power)
        {
            expectedResult = ComplexNumber.multiplyByComplexNumber(expectedResult, expectedResult);
            i++;
        }

        const actualResult = c1.raiseToPower(power);
        expect(expectedResult.equals(actualResult));


    });



});