'use strict';

import IMode from './IMode';
import Player from './Player';
import GameField from './GameField';
import Timer from './Timer';
import InitialPlayerData from './InitialPlayerData';

export default class SingleplayerMode implements IMode {
    _players: Array<Player>;
    _GameField: GameField;
    _Timer: Timer;
    gameFieldRange: number; 
    
    constructor (gameFieldRange: number = 8) {
        this.gameFieldRange = gameFieldRange;
        this._players = new Array<Player>();
        this._Timer = new Timer();
        this._GameField = new GameField(this.gameFieldRange);
        this.init();
    }

    init(): void {
        this.addPlayer(new Player(new InitialPlayerData()));
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }

}