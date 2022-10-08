import { IEquatable } from './IEquatable';
export class ComplexNumber implements IEquatable
{
    /**real component */
    public realPart: number;
    /**imaginary component */
    public imaginaryPart: number;

    /**
     * ComplexNumber constructor. Note: If you do not know the initial values desired, you can create use new ComplexNumber(0,0)
     * @constructor
     * @param {number} a - real component .
     * @param {number} b - imaginary component.
     */
    constructor(a: number, b: number)
    {
        this.realPart = a;
        this.imaginaryPart = b;
    }

    /**
     * e raised to i theta is a fundamental formula for how to specify a complex number; 
     * so much so we should have an alternate constructor for this formula, but TypeScript 
     * does not allow overload constructors, so this static factory method was created. 
     * Factory methods are usually in a separate file, but it is not work a separate file 
     * for a single static factory method.
     * @param theta the angle in radians
     * @returns ComplexNumber
     */
    public static eToITheta(theta: number): ComplexNumber
    {
        return new ComplexNumber(Math.cos(theta), Math.sin(theta));
    }

    /**
     * create new complex number ith the same real and imaginary part as this complex number
     * @returns new ComplexNumber with the same values as this one.
     */
    public clone(): ComplexNumber
    {
        return new ComplexNumber(this.realPart, this.imaginaryPart);
    }

    /**
     * Ttest if equal to another complex number. (undefined, null, other types, and complex numbers different values return false)
     * @param {any} obj - other vectorto compare.
     */
    public equals(obj: any): boolean
    {
        if (typeof obj === 'undefined')
        {
            return false;
        }
        else if (obj == null)
        {
            return false;
        }
        //TODO : parse json?
        else if (obj instanceof ComplexNumber)
        {
            return (this.realPart === obj.realPart) && (this.imaginaryPart === obj.imaginaryPart);
        }
        else
        {
            return false;
        }
    }

    /**
     * Add complex number to this one
     * @param {ComplexNumber} other - the other complex number you want to add to this one
     * @returns {ComplexNumber} reference to this after adding other complex number
     */
    public add(other: ComplexNumber): ComplexNumber
    {
        this.realPart += other.realPart;
        this.imaginaryPart += other.imaginaryPart;
        return this;
    }

    /**
     * Get sum of two complex numbers without modifying either
     * @param c1 {ComplexNumber} first complex number
     * @param c2 {ComplexNumber} second complex number
     * @returns {ComplexNumber} sum of first and second complex number
     */
    public static add(c1: ComplexNumber, c2: ComplexNumber): ComplexNumber
    {
        let sum = c1.clone() as ComplexNumber;
        return sum.add(c2);
    }

    /**
     * Subtract complex number from this one
     * @param {ComplexNumber} other - the other complex number you want to subtract from this one
     * @returns {ComplexNumber} reference to this after subtracting the other complex number
     */
    public subtract(other: ComplexNumber): ComplexNumber
    {
        this.realPart -= other.realPart;
        this.imaginaryPart -= other.imaginaryPart;
        return this;
    }

    /**
     * Get first complex number minus second complex number without modifying either
     * @param c1 {ComplexNumber} first complex number
     * @param c2 {ComplexNumber} second complex number
     * @returns {ComplexNumber} difference of first and second complex number
     */
    public static subtract(c1: ComplexNumber, c2: ComplexNumber): ComplexNumber
    {
        let diff = c1.clone() as ComplexNumber;
        return diff.subtract(c2);
    }

    /**
     * Multiply this complex number by a scalar
     * @param {number} scalar scalar number to multilpy this complex number by
     * @returns {ComplexNumber} reference to this ComplexNumber after scaling
     */
    public multiplyByScalar(scalar: number): ComplexNumber
    {
        this.realPart *= scalar;
        this.imaginaryPart *= scalar;
        return this;
    }

    /**
     * Multiply a complex number by a scalar
     * @param {number} scalar scalar number to multilpy by
     * @returns {ComplexNumber} new Rectangular number after scaling
     */
    public static multiplyByScalar(scalar: number, c: ComplexNumber): ComplexNumber
    {
        let result = c.clone() as ComplexNumber;
        return result.multiplyByScalar(scalar);
    }

    /**
     * Divide this complex number by a scalar
     * @param {number} scalar scalar number to divide this complex number by
     */
    public divideByScalar(scalar: number): ComplexNumber
    {
        this.realPart /= scalar;
        this.imaginaryPart /= scalar;
        return this;
    }

    /***
     * Mulitply this complex number by another complex number
     * @param {ComplexNumber} other - the other complex number to mulitply this complex number by
     * @returns {ComplexNumber} this after multiplication
     */
    public multiplyByComplexNumber(other: ComplexNumber): ComplexNumber
    {
        this.realPart = this.realPart * other.realPart - this.imaginaryPart * other.imaginaryPart;
        this.imaginaryPart = this.realPart * other.imaginaryPart + other.realPart * this.imaginaryPart;
        return this;
    }

    /**
     * Get new complex number which is the product of two complex numbers without modifying either of the complex numbers
     * @param c1 {ComplexNumber} first complex number
     * @param c2 {ComplexNumber} second complex number
     * @returns new {ComplexNumber} which is the product of c1 and c2
     */
    public static multiplyByComplexNumber(c1: ComplexNumber, c2: ComplexNumber): ComplexNumber
    {
        let result = c1.clone();
        result.multiplyByComplexNumber(c2);
        return result;
    }

    /***
     * Square this complex number and return reference to this
     */
    public square(): ComplexNumber
    {
        this.realPart = this.realPart * this.realPart - this.imaginaryPart * this.imaginaryPart;
        this.imaginaryPart = this.realPart * this.imaginaryPart + this.realPart * this.imaginaryPart;
        return this;
    }

    /**
     * Get radius of this complex number on the complex plane
     * @returns number for radius
     */
    public getRadius(): number{
        return Math.sqrt(this.realPart * this.realPart + this.imaginaryPart * this.imaginaryPart);
    }

    /**
     * Get angle for this complex number on the complex plane
     * @returns angle in radians
     */
    public getAngle(): number
    {
        let theta = 0;
        if (this.realPart == 0 || this.imaginaryPart == 0)
        {
            if (this.realPart == 0)
            {
                if (this.imaginaryPart > 0)
                {
                    theta = Math.PI / 2;
                }
                else
                {
                    theta = 3 * Math.PI / 2;
                }
    
            }
            else
            {
                //TODO:  unit test!!!!!!!!!!!!!!!!!!
                theta = Math.atan(this.imaginaryPart / this.realPart);
                if (this.realPart < 0 && this.imaginaryPart > 0)
                {
                    theta += Math.PI / 2;
                }
                else if (this.realPart < 0 && this.imaginaryPart < 0)
                {
                    theta += Math.PI ;
                }
            }
        }

        return theta;
    }

    /**
     * raise this complex number to a power and return reference to this (modified this)
     * @param power {number} exponent to raise this complex nuber to
     * @returns {ComplexNumber} reference to this complex number after modifying this
     */
    public raiseToPower(power: number): ComplexNumber
    {
        let theta = power * this.getAngle() ;
        let radius = power * this.getRadius();
        this.realPart = radius * Math.cos(theta);
        this.imaginaryPart = radius * Math.sin(theta);
        return this;
    }

    /**
     * raise a complex number to a power and return a new complex number object so the original object is not modified
     * @param c {ComplexNuber} complex number object
     * @param power {number} exponent to raise complex number c to
     * @returns {ComplexNumber} new complex number raised to power
     */
    public static raiseToPower(c: ComplexNumber, power: number): ComplexNumber
    {
        let result = c.clone() as ComplexNumber;
        result = result.raiseToPower(power);
        return result;
    }

}
