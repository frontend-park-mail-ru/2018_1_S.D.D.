'use strict';
import InitialPlayerData from './InitialPlayerData';
import Point from './Point';
import GameEventBus from './GameEventBus';
import {Direction} from './Direction';

export default class Player {
    private _id: number;
    private _color: string;
    private _score: number;
    private _direction: Direction;
    private _changeDirection: Direction;
    private _position: Point;
    private _velocity: number = 4;

    constructor (id:number) {
        this._id = id;
        this._score = 0;

        if (this._id == 1) {
            this._direction = Direction.RIGHT;
            this._position = new Point(50,50);
        }

        if (this._id == 2) {
            this._direction = Direction.DOWN;
            this._position = new Point(750,50);
        }

        if (this._id == 3) {
            this._direction = Direction.LEFT;
            this._position = new Point(750,750);
        }

        if (this._id == 4) {
            this._direction = Direction.UP;
            this._position = new Point(50,750);
        }

        this._changeDirection = this._direction;

        this.subscribeOnPlayerInput()
    }

    subscribeOnPlayerInput () {
        const Bus = GameEventBus;
        Bus.subscribe('PRESSED:UP',() => { this._changeDirection = Direction.UP }, this);
        Bus.subscribe('PRESSED:DOWN',() => { this._changeDirection = Direction.DOWN }, this);
        Bus.subscribe('PRESSED:LEFT',() => { this._changeDirection = Direction.LEFT }, this);
        Bus.subscribe('PRESSED:RIGHT',() => { this._changeDirection = Direction.RIGHT }, this);
    }

    move () {
        
        switch(this._direction) { 
            case Direction.UP: { 
                this._position.y -= this._velocity;
                if  (this._position.y < 50) this._position.y = 50;
               break; 
            } 
            case Direction.DOWN: { 
                this._position.y += this._velocity;
                if  (this._position.y > 750) this._position.y = 750;
               break; 
            }
            case Direction.LEFT: { 
                this._position.x -= this._velocity;
                if  (this._position.x < 50) this._position.x = 50;
               break;
            } 
            case Direction.RIGHT: { 
                this._position.x += this._velocity;
                if  (this._position.x > 750) this._position.x = 750;
               break; 
            }  
        } 

        const Bus = GameEventBus;
        if (((this._position.x-50)%100 == 0) && ((this._position.y-50)%100 == 0)) {
            // TODO: Change on define
            let x_idx = (this._position.x-50) / 100;
            let y_idx = (this._position.y-50) / 100;

            Bus.emit('STEPPED',[this._id, x_idx, y_idx]);
            this.directionSwtich();
        }
    }

    directionSwtich () {
        this._direction = this._changeDirection;
    }

    set score(score: number) {
        this._score = score;
    }

    get position(): Point {
        return this._position;
    }

    get id(): number {
        return this._id;
    }

    get score (): number {
        return this._score;
    }
}