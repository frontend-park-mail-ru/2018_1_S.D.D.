'use strict';
import Player from '../Player';
import GameField from '../GameField';
import Timer from '../Timer';

export default abstract class Mode {
    readonly _players: Array<Player>;
    readonly _GameField: GameField;
    readonly _Timer: Timer;

    constructor() {
        
    }
}