'use strict';

import Mode from './Mode';
import Player from '../Player';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';

export default class SingleplayerMode extends Mode {
    _players: Array<Player>;
    _GameField: GameField;
    _Timer: Timer;
    gameFieldRange: number; 
    
    constructor (Scene: Scene, gameFieldRange: number = 8) {
        super();
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