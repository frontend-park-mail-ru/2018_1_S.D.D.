import { COLOR_MAP } from '../../settings';
import Drawable from '../Drawable';
import Point from '../Point';
import Field from './Field';

/**
 * Initialize cell and it's behaviour.
 *
 * @class
 * @classdesc Cell object.
 */
export default class Cell extends Drawable {
    /**
     * Cell size (in pixels).
     */
    public static size: number;

    /**
     * Cell size with margins (in pixels).
     */
    public static realSize: number;

    /**
     * Position on field.
     */
    public position: Point;

    /**
     * Real position on screen (in pixels);
     */
    public screenPosition: Point;

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
        this.setCellScreenPosition();
    }

    /**
     * Draw cell. Calculate new size and position (depends on scaling)
     */
    public draw(): void {
        const margin = this.margin * this.scale;

        this.changeColor();
        this.bg(this.color, 0.6);
        this.setCellSize();
        this.setCellScreenPosition();

		      this.canvas.fillRect(
            this.position.x * Cell.size + margin / 2 * (this.position.x * 2 + 1),
            this.position.y * Cell.size + margin / 2 * (this.position.y * 2 + 1),
            Cell.size, Cell.size,
        );
    }

    /**
     * Change backgound color of cell.
     */
    private changeColor() {
        this.color = COLOR_MAP.get(this.player);
    }

    /**
     * Set new real cell size (in pixels).
     */
    private setCellSize() {
        Cell.size = this.canvasHeight / Field.range - this.margin * this.scale;
    }

    /**
     * Set new real cell position on screen (in pixels).
     */
    private setCellScreenPosition() {
        Cell.realSize = Cell.size + this.margin * this.scale;
        this.screenPosition = new Point(this.position.x * Cell.realSize, this.position.y * Cell.realSize);
    }
}
