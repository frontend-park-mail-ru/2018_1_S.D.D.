import Drawable from "../Drawable";
import Field from "./Field";
import Point from '../Point';
import { COLOR_MAP } from '../../settings';

/**
 * Initialize cell and it's behaviour.
 * 
 * @class
 * @classdesc Cell object.
 */
export default class Cell extends Drawable {
    /**
     * Position on field.
     */
    public position: Point;

    /**
     * Real position on screen (in pixels);
     */
    public screenPosition: Point;

    /**
     * Real cell size (in pixels).
     */
    public static size: number;

    /**
     * Id of player owned the cell.
     * 0: neutral.
     * 1-4: players.
     */
    public player: number = 0;

    /**
     * Was cell marked as scored.
     */
    public scored: boolean = false;

    /**
     * Was cell marked as bad area.
     */
    public bad: boolean = false;

    /**
     * Cell color.
     */
    private color: string;

    /**
     * Margins between cells.
     */
    private margin: number = 6;

    /**
     * Initialize cell and it's behaviour.
     * 
     * @param position X, Y coordinate on field.
     */
    constructor(position: Point) {
        super();
        this.position = position;
        this.setCellSize();
        const realSize = Cell.size + this.margin;
        this.screenPosition = new Point(this.position.x * realSize, this.position.y * realSize);
        this.changeColor();
    }

    /**
     * Draw cell.
     */
    public draw(): void {
        this.bg(this.color, 0.6);
        this.setCellSize();
		this.canvas.fillRect(
            this.position.x * Cell.size + this.margin / 2 * (this.position.x * 2 + 1), 
            this.position.y * Cell.size + this.margin / 2 * (this.position.y * 2 + 1), 
            Cell.size, Cell.size
        );
    }

    /**
     * Change backgound color of cell.
     */
    private changeColor() {
        this.color = COLOR_MAP.get(this.player)
    }

    /**
     * Set new real cell size (in pixels).
     */
    private setCellSize(): number {
        return Cell.size = this.canvasHeight / Field.range - this.margin;
    }
}