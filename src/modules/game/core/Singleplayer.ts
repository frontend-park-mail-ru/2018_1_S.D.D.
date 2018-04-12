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

    init(): void {
        const Bus = GameEventBus;
        Bus.subscribe('PRESSED:UP', () => {
            console.log("YOU PRESSED UP");
        }, this);
        Bus.subscribe('PRESSED:DOWN', () => {
            console.log("YOU PRESSED DOWN");
        }, this);
        Bus.subscribe('PRESSED:LEFT', () => {
            console.log("YOU PRESSED LEFT");
        }, this);
        Bus.subscribe('PRESSED:RIGHT', () => {
            console.log("YOU PRESSED RIGHT");
        }, this);
        this.addPlayer(new Player());
    }

    addPlayer(player: Player): void {
        this._players.push(player);
    }

}