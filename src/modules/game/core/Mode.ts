'use strict';
import Player from '../Player';
import GameField from '../GameField';
import Timer from '../Timer';

export default abstract class Mode {
    protected readonly _players: Array<Player>;
    protected readonly _GameField: GameField;
    protected readonly _Timer: Timer;
    protected gameFieldRange: number;

    constructor (gameFieldRange: number) {
        this.gameFieldRange = gameFieldRange;
        this._players = new Array<Player>();
        this._Timer = new Timer();
        this._GameField = new GameField(this.gameFieldRange);
    }
}