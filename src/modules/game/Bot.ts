'use strict';
import Player from './Player';

export default class Bot extends Player {
    constructor (id:number) {
        super(id);
    }

    directionSwtich () {
        this._direction = Math.floor(Math.random() * (5 - 1)) + 1;
        console.log(this._id,this._direction);
    }
}

