'use strict';

import Mode from './Mode';
import Player from '../Player';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';

export default class SingleplayerMode extends Mode {
    
    constructor (Scene: Scene, gameFieldRange: number = 8) {
        super(gameFieldRange);
        this.init();
    }

    init(): void {
        this.addPlayer(new Player());
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }

}