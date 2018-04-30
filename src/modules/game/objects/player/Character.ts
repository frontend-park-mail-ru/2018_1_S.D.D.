import Drawable from "../Drawable";
import GameEventBus from '../../GameEventBus';

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
     * Character unique identificator.
     */
    protected id: number;

    /**
     * Color associated with this character.
     */
    protected color: string;

    /**
     * Score of this character in current game.
     */
    protected score: number;

    /**
     * Character current velocity.
     */
    protected velocity: number;

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
     */
    constructor(id: number, name: string) {
        super();
        this.subscribeMovement();
        this.subscribeScore();
    }

    /**
     * Listen events on which charater will change movement direction.
     */
    subscribeMovement(): void {
        GameEventBus.subscribe(`MOVE.UP:${this.id}`, () => { this.nextDirection = Direction.UP; }, this);
        GameEventBus.subscribe(`MOVE.DOWN:${this.id}`, () => { this.nextDirection = Direction.DOWN; }, this);
        GameEventBus.subscribe(`MOVE.LEFT:${this.id}`, () => { this.nextDirection = Direction.LEFT; }, this);
        GameEventBus.subscribe(`MOVE.RIGHT:${this.id}`, () => { this.nextDirection = Direction.RIGHT; }, this);
    }

    /**
     * Listen event on which character gets some scores.
     */
    subscribeScore(): void {
        GameEventBus.subscribe(`SCORE:${this.id}`, score => { this.score += score; }, this);
    }

    /**
     * Set next direction as current direction.
     */
    switchDirection(): void {
        this.direction = this.nextDirection;
    }
}