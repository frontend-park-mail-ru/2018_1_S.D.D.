'use strict';
import InitialPlayerData from './InitialPlayerData';
import Point from './Point';
import {Direction} from './Direction';

export default class Player {
    private _id: number;
    private _color: string;
    private _score: number;
    private _direction: Direction;
    private _changeDirection: Direction;
    private _position: Point;

    constructor () {
        this._score = 0;
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