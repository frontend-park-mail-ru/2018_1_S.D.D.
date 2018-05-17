import Scene from '../Scene';
/**
 * Sets canvas for object.
 *
 * @class
 * @classdesc Parent class for all drawable objects.
 */
export default abstract class Drawable {
    /**
     * @returns Height of canvas DOM element.
     */
    protected get canvasHeight(): number {
        return Scene.sceneCanvas.height;
    }

    /**
     * @returns Width of canvas DOM element.
     */
    protected get canvasWidth(): number {
        return Scene.sceneCanvas.width;
    }

    /**
     * @returns Scale depends on sreen size.
     */
    protected get scale(): number {
        const scaleFactor = this.canvasWidth > this.canvasHeight ? this.canvasHeight : this.canvasWidth;
              return scaleFactor / Scene.size;
    }

    /**
     * @returns DOM canvas element.
     */
    protected get canvas(): CanvasRenderingContext2D {
        return Scene.sceneCanvasContext;
    }

    /**
     * Draw object.
     */
    public draw(): void {
        this.canvas.fillRect(0, 0, 0, 0);
    }

    /**
     * Create full circle. Next drawing in this circle.
     *
     * @param x X coordinate of center.
     * @param y Y coordinate of center.
     */
    protected circle(x: number, y: number, radius: number): void {
        this.canvas.save();
              this.canvas.beginPath();
              this.canvas.arc(x, y, radius, 0, 2 * Math.PI);
              this.canvas.fill();
              this.canvas.closePath();
              this.canvas.clip();
    }

    /**
     * Restore context.
     */
    protected unCircle(): void {
        this.canvas.restore();
    }

    /**
     * Set background color.
     *
     * @param color Background color
     * @param opacity Background alpha-channel.
     */
    protected bg(color: string, opacity: number = 1): void {
        this.canvas.globalAlpha = opacity;
        this.canvas.fillStyle = color;
    }

    /**
     * Draw image.
     *
     * @param img Image to draw.
     * @param x X coordinate of top left corner.
     * @param y Y coordinate of top left corner.
     * @param size Size of image.
     */
    protected image(img: HTMLImageElement, x: number, y: number, size: number) {
        if (img.naturalWidth !== 0) {
            this.canvas.drawImage(img, x, y, size, size);
        }
    }
}
