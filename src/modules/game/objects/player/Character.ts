import Drawable from '../Drawable';
import Point from '../Point';
import GameEventBus from '../../GameEventBus';
import Cell from '../field/Cell';
import Scene from '../../Scene';
import { COLOR_MAP, CHARACTER_VELOCITY } from '../../settings';
import * as defaultAvatar from '../../bin/1.svg';

/**
 * Possible directions on field.
 */
enum Direction {
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

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
     * Player position on field (on cell).
     */
    private startPosition: Point;

    /**
     * Movement offset between cells.
     */
    private moveOffset: number = 0;

    /**
     * Character avatar.
     */
    public avatar: HTMLImageElement;

    /**
     * Character unique identificator.
     */
    public id: number;

    /**
     * Color associated with this character.
     */
    protected color: string;

    /**
     * Score of this character in current game.
     */
    protected score: number = 0;

    /**
     * Character current velocity.
     */
    protected velocity: number = CHARACTER_VELOCITY;

    /**
     * Current character movement direction.
     */
    protected direction: Direction;

    /**
     * New character movement direction. 
     * Would apply after character step on field.
     */
    protected nextDirection: Direction;

    /**
     * Character ingame nickname.
     */
    protected name: string;

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
        this.avatar = new Image();
        this.avatar.src = defaultAvatar;
    }

    /**
     * Set next direction as current direction.
     */
    protected switchDirection(): void {
        this.direction = this.nextDirection;
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
        GameEventBus.subscribe(`SCORE:${this.id}`, score => { this.score += score; }, this);
    }

    /**
     * Set custom avatar by url.
     * 
     * @param url Url to image. 
     */
    setAvatar(url: string): void {
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
		const x = this.startPosition.x * Cell.realSize + Cell.size / 2 + margin / 2;
        const y = this.startPosition.y * Cell.realSize + Cell.size / 2 + margin / 2;
        
		this.circle(x, y, radius);
        
        // PosX, PosY - top left corner
		const imgPosX = x - imgSize / 2;
        const imgPosY = y - imgSize / 2;

        this.image(this.avatar, imgPosX, imgPosY, imgSize);
        
		this.unCircle();
    }
}