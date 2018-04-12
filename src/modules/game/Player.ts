'use strict';
import InitialPlayerData from './InitialPlayerData';

export default class Player {
    private _id: number;
    private _color: string;
    private _score: number;

    constructor () {
        this._score = 0;
    }

    set score(score: number) {
        this._score = score;
    }

    get score (): number {
        return this._score;
    }
}