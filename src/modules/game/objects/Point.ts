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
    public x: number;

    /**
     * Y coordinate
     */
    public y: number;

    /**
     * Set X and Y coordinates.
     *
     * @param x X coordinate
     * @param y Y coordinate
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}
