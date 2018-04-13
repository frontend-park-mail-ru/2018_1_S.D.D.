'use strict';
import Player from './Player';
import { Direction } from './Direction';

export default class Bot extends Player {
    constructor (id:number, name?: string) {
        super(id);
        this._name = name;
    }

    directionSwtich (): void {
        const directionKeys = Object.keys(Direction).filter(k => typeof Direction[k as any] === "number");
        const directionValues = directionKeys.map(k => parseInt(Direction[k as any]));
        const max = Math.max.apply(null, directionValues);
        const min = Math.min.apply(null, directionValues);

        this._direction = Math.floor(Math.random() * max) + min;
        console.log(this._id,this._direction);
    }
}

