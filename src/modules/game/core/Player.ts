'use strict';
import InitialPlayerData from './InitialPlayerData';

export default class Player {
    private _id: number;
    private _color: string;
    private _score: number;

    constructor (initData: InitialPlayerData) {
        this._id = initData.id;
        this._color = initData.color;
        this._score = 0;
    }

    set score (score: number) {
        this._score = score;
    }

    get score (): number {
        return this._score;
    }
}