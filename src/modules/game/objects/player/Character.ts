import * as defaultAvatar from '../../bin/1.svg';
import GameEventBus from '../../GameEventBus';
import Scene from '../../Scene';
import { CHARACTER_VELOCITY, COLOR_MAP, DIRECTION_MAP } from '../../settings';
import Drawable from '../Drawable';
import Cell from '../field/Cell';
import Field from '../field/Field';
import Point from '../Point';
import { Direction } from './directions';

/**
 * Initializes charcter in the beginning of game.
 *
 * @class
 * @classdesc Abstract class. Defines common behaviour for player and bot.
 */
export default abstract class Character extends Drawable {
    /**
     * Did last step got scores?
     */
    public gotScore: boolean = false;

    /**
     * Character avatar.
     */
    public avatar: HTMLImageElement;

    /**
     * Character unique identificator.
     */
    public id: number;

    /**
     * Character current velocity.
     */
    public velocity: number = CHARACTER_VELOCITY;

    /**
     * Color associated with this character.
     */
    protected color: string;

    /**
     * Score of this character in current game.
     */
    protected score: number = 0;

    /**
     * Current character movement direction.
     */
    protected direction: Direction;

    /**
     * New character movement direction.
     * Would apply after character step on field.
     */
    protected nextDirection: Direction ;

    /**
     * Character ingame nickname.
     */
    protected name: string;

    /**
     * Player position on field (on cell).
     */
    private startPosition: Point;

    /**
     * Movement offset between cells.
     */
    private moveOffset: Point = new Point(0, 0);

    /**
     * Initializes charater in the beginning of game.
     *
     * @param id Character unique identificator.
     * @param name Character ingame nickname.
     * @param startPosition Coordinates of cell to spawn in.
     */
    constructor(id: number, name: string, startPosition: Point = new Point(0, 0)) {
        super();
        this.id = id;
        this.name = name;
        this.startPosition = startPosition;
        GameEventBus.emit('STEPPED', [id, startPosition]); // mark start cell

        this.subscribeMovement();
        this.subscribeScore();
        this.color = COLOR_MAP.get(id);
        this.direction = DIRECTION_MAP.get(id);
        this.nextDirection = this.direction;
        this.avatar = new Image();
        this.avatar.src = defaultAvatar;
    }

    /**
     * Move player across the field.
     *
     * @param time Time spended from last move call.
     */
    public move(time: number): void {
        const prevPosition = new Point(this.startPosition.x, this.startPosition.y);

        const distance = time * this.velocity;
        if (distance < 0) {
            return;
        }

        if (this.moveOffset.x === 0 && this.moveOffset.y === 0) {
            this.switchDirection();
        }

        let stepped: boolean = false;

        switch (this.direction) {
            case Direction.UP:
                if (this.startPosition.y === 0) {
                    this.moveOffset.y = 0;
                    return;
                }
                this.moveOffset.y -= distance;
                if (this.moveOffset.y <= -100) {
                    this.startPosition.y--;
                    this.moveOffset.y += 100;
                    stepped = true;
                }
                break;
            case Direction.DOWN:
                if (this.startPosition.y === Field.range - 1) {
                    this.moveOffset.y = 0;
                    return;
                }
                this.moveOffset.y += distance;
                if (this.moveOffset.y >= 100) {
                    this.startPosition.y++;
                    this.moveOffset.y -= 100;
                    stepped = true;
                }
                break;
            case Direction.LEFT:
                if (this.startPosition.x === 0) {
                    this.moveOffset.x = 0;
                    return;
                }
                this.moveOffset.x -= distance;
                if (this.moveOffset.x <= -100) {
                    this.startPosition.x--;
                    this.moveOffset.x += 100;
                    stepped = true;
                }
                break;
            case Direction.RIGHT:
                if (this.startPosition.x === Field.range - 1) {
                    this.moveOffset.x = 0;
                    return;
                }
                this.moveOffset.x += distance;
                if (this.moveOffset.x >= 100) {
                    this.startPosition.x++;
                    this.moveOffset.x -= 100;
                    stepped = true;
                }
                break;
        }

        if (stepped) {
            GameEventBus.emit('STEPPED', [this.id, this.startPosition, prevPosition]);
            this.switchDirection();
        }
    }

    /**
     * Set custom avatar by url.
     *
     * @param url Url to image.
     */
    public setAvatar(url: string): void {
        if (url.length !== 0) {
            this.avatar.src = url;
        }
    }

    /**
     * Draw player.
     */
    public draw(): void {
        this.bg(this.color);
        const margin = 5 * this.scale;
        const border = 4 * this.scale;
        const radius = (Cell.size / 2) - margin;
        const imgSize = radius * 2 - border * 2;

        // x, y - center
        const startx = this.startPosition.x * Cell.realSize;
        const starty = this.startPosition.y * Cell.realSize;
		      const x = startx + Cell.realSize * this.moveOffset.x / 100 + Cell.size / 2 + margin / 2;
        const y = starty + Cell.realSize * this.moveOffset.y / 100 + Cell.size / 2 + margin / 2;

		      this.circle(x, y, radius);

        // PosX, PosY - top left corner
		      const imgPosX = x - imgSize / 2;
        const imgPosY = y - imgSize / 2;

        this.image(this.avatar, imgPosX, imgPosY, imgSize);

		      this.unCircle();
    }

    /**
     * Set next direction as current direction.
     */
    protected switchDirection(): void {
        if (this.direction !== this.nextDirection) {
            this.moveOffset.x = 0;
            this.moveOffset.y = 0;
            this.direction = this.nextDirection;
        }
    }

    /**
     * Listen events on which charater will change movement direction.
     */
    private subscribeMovement(): void {
        GameEventBus.subscribe(`MOVE.UP:${this.id}`, () => { this.nextDirection = Direction.UP; }, this);
        GameEventBus.subscribe(`MOVE.DOWN:${this.id}`, () => { this.nextDirection = Direction.DOWN; }, this);
        GameEventBus.subscribe(`MOVE.LEFT:${this.id}`, () => { this.nextDirection = Direction.LEFT; }, this);
        GameEventBus.subscribe(`MOVE.RIGHT:${this.id}`, () => { this.nextDirection = Direction.RIGHT; }, this);
    }

    /**
     * Listen event on which character gets some scores.
     */
    private subscribeScore(): void {
        GameEventBus.subscribe(`SCORE:${this.id}`, (score) => { this.score += score; }, this);
    }
}
