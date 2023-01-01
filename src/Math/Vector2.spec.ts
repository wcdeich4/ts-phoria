import Vector2 from './Vector2';

describe('Vector2 Unit Tests', () => {

    it('Vector2 Clone', () => {
        const v = new Vector2();
        v.set(5,7);
        let w = v.clone();
        expect(v[0]).toEqual(w[0]);
        expect(v[1]).toEqual(w[1]);
    });
  
    it('Vector2 toVector3', () => {
        const v = new Vector2();
        v.set(5,7);
        let z = 9;
        let w = v.toVector3(z);
        expect(v[0]).toEqual(w[0]);
        expect(v[1]).toEqual(w[1]);
        expect(z).toEqual(w[2]);
    });

    it('Vector2 toVector4', () => {
        const v = new Vector2();
        v.set(5,7);
        let z = 9;
        let w = 12;
        let u = v.toVector4(z, w);
        expect(v[0]).toEqual(u[0]);
        expect(v[1]).toEqual(u[1]);
        expect(z).toEqual(u[2]);
        expect(w).toEqual(u[3]);
    });

    it('Vector2 normalize', () => {
        const v = new Vector2();
        v.set(12, 4);
        const u = v.normalize();
        const actualLength = u.length();

        //javascript floating pointing numbers have limited accuracy
        const tolerance = 0.00000000000001;
        expect(Math.abs(actualLength - 1) < tolerance).toEqual(true);
    });



});