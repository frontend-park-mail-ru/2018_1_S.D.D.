import Scene from '../Scene';

/**
 * @class
 * @classdesc Parent class for all drawable objects.
 */
export default abstract class Drawable {
    /**
     * DOM canvas element.
     */
    protected canvas: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Scene.sceneCanvasContext;
    }

    /**
     * Draw object.
     */
    public draw() {
        this.canvas.fillRect(0,0,0,0);
    }
}