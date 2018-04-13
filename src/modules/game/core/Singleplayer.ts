'use strict';

import Mode from './Mode';
import Player from '../Player';
import Bot from '../Bot';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';
import GameEventBus from '../GameEventBus';
import { BOT_NAMES } from '../defines';
export {BOT_NAMES} from '../defines';

export default class SingleplayerMode extends Mode {
    private tickDelay: number;
    private Scene: Scene;
    private gameLoopReqId: number;

    constructor (Scene: Scene, gameFieldRange: number = 8, ticksInSecond: number = 2000) {
        super(gameFieldRange);

        this.Scene = Scene;
        this.tickDelay = 1000/ticksInSecond;

        this.init();
    }

    private init(): void {
        this.addPlayer(new Player(1, 'YOU'));
        this.addPlayer(new Bot(2, BOT_NAMES[0]));
        this.addPlayer(new Bot(3, BOT_NAMES[1]));
        this.addPlayer(new Bot(4, BOT_NAMES[2]));

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
        //this._players[0].move();
        this.Scene.clear();
        this.Scene.drawField(this._GameField.getGameMatrix());

        this._players.forEach(player => {
            player.move();
            this.Scene.drawPlayer(player);
            this.Scene.drawPlayerInfo(this._players);
        });

        //console.log(this._players[0].)
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }
}