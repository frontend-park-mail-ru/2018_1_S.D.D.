'use strict';

import Mode from './Mode';
import Player from '../Player';
import GameField from '../GameField';
import Timer from '../Timer';
import InitialPlayerData from '../InitialPlayerData';

export default class SingleplayerMode extends Mode {
    readonly _players: Array<Player>;
    readonly _GameField: GameField;
    readonly _Timer: Timer;
    gameFieldRange: number;

    constructor (gameFieldRange: number = 8) {
        super()
        this.gameFieldRange = gameFieldRange;
        this._players = new Array<Player>();
        this._Timer = new Timer();
        this._GameField = new GameField(this.gameFieldRange);
        this.init();
    }

    init(): void {
        this.addPlayer(new Player());
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }


}