import ServiceManager from '../../../ServiceManager';
import * as defaultAvatar from '../../bin/1.svg';
import GameEventBus from '../../GameEventBus';
import MetaController from '../../MetaController';
import Scene from '../../Scene';
import SessionSettings from '../../SessionSettings';
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
     * Is this curretn player?
     */
    public isCurrentPlayer: boolean = false;

    /**
     * Character unique identificator.
     */
    public id: number;

    /**
     * Character ingame nickname.
     */
    public name: string;

    /**
     * Score of this character in current game.
     */
    public score: number = 0;

    /**
     * Character current velocity.
     */
    public velocity: number = CHARACTER_VELOCITY;

    /**
     * Can player move or not.
     */
    public stucked: boolean = false;

    /**
     * Player position on field (on cell).
     */
    public startPosition: Point;

    /**
     * Movement offset between cells.
     */
    public moveOffset: Point = new Point(0, 0);
    // public moveOffset: number = 0;/

    public clearOffset: number = 0;

    /**
     * Current character movement direction.
     */
    public direction: Direction;

    /**
     * New character movement direction.
     * Would apply after character step on field.
     */
    public nextDirection: Direction;

    /**
     * Color associated with this character.
     */
    protected color: string;

    /**
     * Initializes charater in the beginning of game.
     *
     * @param id Character unique identificator.
     * @param name Character ingame nickname.
     * @param startPosition Coordinates of cell to spawn in.
     * @param isCurrentPlayer Defines if this player is current user.
     */
    constructor(id: number, name: string, startPosition: Point = new Point(0, 0), isCurrentPlayer: boolean = false) {
        super();
        this.id = id;
        this.name = name;
        this.startPosition = startPosition;
        this.isCurrentPlayer = isCurrentPlayer;
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
        if (distance < 0 || this.stucked) {
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
     * Set next direction as current direction.
     */
    public switchDirection(): void {
        if (this.direction !== this.nextDirection) {
            this.moveOffset.x = 0;
            this.moveOffset.y = 0;
            this.direction = this.nextDirection;
        }
    }

    /**
     * Draw player.
     * Dima (HaseProgr) is a gay 💩. Where are commentaries for variables?
     * FFS
     */
    public draw(): void {
        //console.log(this);
        this.bg(this.color);
        const margin = 5 * this.scale;
        const border = 4 * this.scale;
        const radius = (Cell.size / 2) - margin;
        const imgSize = radius * 2 - border * 2;

        // x, y - center
        const startx = this.startPosition.x * Cell.realSize;
        const starty = this.startPosition.y * Cell.realSize;
        
        let offsetX = 0;
        let offsetY = 0;
        switch (this.direction)  {
            case Direction.LEFT:
                offsetX = -this.clearOffset; 
                break;
            case Direction.RIGHT: 
                offsetX = this.clearOffset;
                break;
            case Direction.UP: 
                offsetY = -this.clearOffset;
                break;
            case Direction.DOWN: 
                offsetY = this.clearOffset;
                break;
            default:
                break;
        }

        const x = startx + Cell.realSize * offsetX / 100 + Cell.size / 2 + margin / 2;
        const y = starty + Cell.realSize * offsetY / 100 + Cell.size / 2 + margin / 2;
        // const x = startx + Cell.realSize * this.moveOffset.x / 100 + Cell.size / 2 + margin / 2;
        //const y = starty + Cell.realSize * this.moveOffset.y / 100 + Cell.size / 2 + margin / 2;

        this.circle(x, y, radius);

        // PosX, PosY - top left corner
        const imgPosX = x - imgSize / 2;
        const imgPosY = y - imgSize / 2;

        this.image(this.avatar, imgPosX, imgPosY, imgSize);

        this.unCircle();
    }

    /**
     * Listen events on which charater will change movement direction.
     */
    private subscribeMovement(): void {
        const newDirectionRequest = (direction) => {
            if (SessionSettings.mode === 'offline') { return; }
            const request = {
                class: 'ClientSnapshot',
                direction,
            };
            new ServiceManager().Net.send(request);
        };

        GameEventBus.subscribe(`MOVE.UP:${this.id}`, () => {
            this.nextDirection = Direction.UP; newDirectionRequest('UP');
        }, this);
        GameEventBus.subscribe(`MOVE.DOWN:${this.id}`, () => {
            this.nextDirection = Direction.DOWN; newDirectionRequest('DOWN');
        }, this);
        GameEventBus.subscribe(`MOVE.LEFT:${this.id}`, () => {
            this.nextDirection = Direction.LEFT; newDirectionRequest('LEFT');
        }, this);
        GameEventBus.subscribe(`MOVE.RIGHT:${this.id}`, () => {
            this.nextDirection = Direction.RIGHT; newDirectionRequest('RIGHT');
        }, this);
    }

    /**
     * Listen event on which character gets some scores.
     */
    private subscribeScore(): void {
        GameEventBus.subscribe(`SCORE:${this.id}`, (score) => {
            this.score += score;
            MetaController.updateScores();
        }, this);
    }
}
