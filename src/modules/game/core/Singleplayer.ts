'use strict';

import Mode from './Mode';
import Player from '../Player';
import Bot from '../Bot';
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
        this.SlownessBonus.spawn(1,1);

        this.init();
    }

    private init(): void {
        this.addPlayer(new Player(1));
        this.addPlayer(new Bot(2));
        this.addPlayer(new Bot(3));
        this.addPlayer(new Bot(4));

        //setInterval(this.gameModelTick.bind(this), this.tickDelay);
        this.startGame();
    }

    public addPlayer(player: Player): void {
        SingleplayerMode._players.push(player);
    }

    startGame(): void {
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }

    private drawTick(): void {

    }

    private gameModelTick(): void {
        //this._players[0].move();
        
        this.Scene.clear();
        this.Scene.drawField(SingleplayerMode._GameField.getGameMatrix());
        this.Scene.drawPlayer(SingleplayerMode._players[0]);
        this.Scene.drawBonus(this.SlownessBonus);

        SingleplayerMode._players.forEach(player => {
            player.move();
            this.Scene.drawPlayer(player);
        });

        
        
        //console.log(this._players[0].)
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }
}