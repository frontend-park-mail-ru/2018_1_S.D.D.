'use strict';

import Mode from './Mode';
import Player from '../Player';
import GameField from '../GameField';
import Timer from '../Timer';
import InitialPlayerData from '../InitialPlayerData';

export default class MultiplayerMode extends Mode {
    constructor (gameFieldRange: number = 8) {
        super(gameFieldRange);
        this.init();
    }

    init(): void {
        this.addPlayer(new Player(1));
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }


}