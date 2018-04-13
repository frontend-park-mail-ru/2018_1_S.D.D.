'use strict';
import Player from '../Player';
import GameField from '../GameField';
import Timer from '../Timer';
import InputController from '../InputController';

export default abstract class Mode {
    static  _players: Array<Player>;
    static  _GameField: GameField;
    protected readonly _Timer: Timer;
    protected gameFieldRange: number;

    constructor (gameFieldRange: number) {
        this.gameFieldRange = gameFieldRange;
        Mode._players = new Array<Player>();
        this._Timer = new Timer();
        Mode._GameField = new GameField(this.gameFieldRange);
        new InputController();
    }
}