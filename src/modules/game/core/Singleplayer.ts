'use strict';

import Mode from './Mode';
import Player from '../Player';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';
import GameEventBus from '../GameEventBus';

export default class SingleplayerMode extends Mode {
    
    constructor (Scene: Scene, gameFieldRange: number = 8) {
        super(gameFieldRange);
        this.init();
    }

    private init(): void {
        this.addPlayer(new Player());
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
    }

}