/**
 * Set X and Y coordinates.
 * 
 * @class
 * @classdesc Point with X and Y coordinate.
 */
export default class Point {
    /**
     * X coordinate
     */
    private _x: number;

    /**
     * Y coordinate
     */
    private _y: number;

    /**
     * Set X and Y coordinates.
     * 
     * @param x X coordinate
     * @param y Y coordinate
     */
    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    /**
     * Set X coordinate
     * 
     * @param X coordinate
     */
    set x(x: number) {
        this._x = x;
    }

    /**
     * Get X coordinate
     * 
     * @returns X coordinate
     */
    get x(): number {
        return this._x;
    }

    /**
     * Set Y coordinate
     * 
     * @param Y coordinate
     */
    set y(y: number) {
        this._y = y;
    }

    /**
     * Get Y coordinate
     * 
     * @returns Y coordinate
     */
    get y(): number {
        return this._y;
    }

}