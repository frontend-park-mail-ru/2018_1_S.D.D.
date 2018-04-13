'use strict';
import Player from './Player';
import { Direction } from './Direction';

export default class Bot extends Player {
    private _stayOnCourseCount: number;

    constructor (id:number, name?: string) {
        super(id);
        this._name = name;

        this._stayOnCourseCount = 0;
    }

    directionSwtich (): void {
        const directionKeys = Object.keys(Direction).filter(k => typeof Direction[k as any] === "number");
        const directionValues = directionKeys.map(k => parseInt(Direction[k as any]));
        const max = Math.max.apply(null, directionValues);
        const min = Math.min.apply(null, directionValues);

        if (this._stayOnCourseCount == 0) {
            this._direction = Math.floor(Math.random() * max) + min;
            this._stayOnCourseCount = Math.floor(Math.random() * 4) + 2;
        }
        
        this._stayOnCourseCount--;
    }
}

