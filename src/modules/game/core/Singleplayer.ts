'use strict';

import Mode from './Mode';
import Player from '../Player';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';
import GameEventBus from '../GameEventBus';
import SlownessBonus from '../bonus/SlownessBonus';
import Point from '../Point';

export default class SingleplayerMode extends Mode {
    private tickDelay: number;
    private Scene: Scene;
    private gameLoopReqId: number;

    public SlownessBonus: SlownessBonus;

    constructor (Scene: Scene, gameFieldRange: number = 8, ticksInSecond: number = 2000) {
        super(gameFieldRange);

        this.Scene = Scene;
        this.tickDelay = 1000/ticksInSecond;

        this.SlownessBonus = new SlownessBonus();

        this.init();
    }

    private init(): void {
        this.addPlayer(new Player(0));

        //setInterval(this.gameModelTick.bind(this), this.tickDelay);
        this.startGame();
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
    }

    startGame(): void {
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }

    private drawTick(): void {

    }

    private gameModelTick(): void {
        this._players[0].move();

        this.Scene.clear();
        this.Scene.drawField(this._GameField.getGameMatrix());
        this.Scene.drawPlayer(this._players[0]);
        this.Scene.drawBonus(this.SlownessBonus, new Point(1,1));
        
        //console.log(this._players[0].)
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }
}