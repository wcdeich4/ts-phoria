import Vector2 from './Vector2';

describe('Vector2 Unit Tests', () => {

    it('Vector2 Clone', () => {
        const v = new Vector2();
        v.set(5,7);
        let w = v.clone();
        expect(v[0]).toEqual(w[0]);
        expect(v[1]).toEqual(w[1]);

    });
  



});