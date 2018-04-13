'use strict';

import Mode from './Mode';
import Player from '../Player';
import Bot from '../Bot';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';
import GameEventBus from '../GameEventBus';
import { BOT_NAMES } from '../defines';
import SlownessBonus from '../bonus/SlownessBonus';
import Point from '../Point';
import BonusObject from '../bonus/BonusObject';

export default class SingleplayerMode extends Mode {
    private tickDelay: number;
    private Scene: Scene;
    private gameLoopReqId: number;

    public SlownessBonus: SlownessBonus;
    public Bonuses: Array<BonusObject> = [];
    public ticks: number = 0;

    constructor (Scene: Scene, gameFieldRange: number = 8, ticksInSecond: number = 2000) {
        super(gameFieldRange);

        this.Scene = Scene;
        this.tickDelay = 1000/ticksInSecond;

        this.Bonuses.push(new SlownessBonus());

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
        SingleplayerMode._players.push(player);
    }

    startGame(): void {
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }

    private drawTick(): void {

    }

    private drawBonuses() {
        this.Bonuses.forEach(Bonus => {
            if (!Bonus.isActive()) {
                const rC = (min, max) => {
                    const rand = min - 0.5 + Math.random() * (max - min + 1)
                    return Math.round(rand);
                }
                if (this.ticks % 200 == 0 && rC(0, 3) == 3) {
                    Bonus.spawn(rC(0,7), rC(0,7));
                }
            }
            this.Scene.drawBonus(Bonus);
        })
    }

    private gameModelTick(): void {
        //this._players[0].move();
        this.ticks++;
        
        this.Scene.clear();
        this.Scene.drawField(SingleplayerMode._GameField.getGameMatrix());
        this.Scene.drawPlayer(SingleplayerMode._players[0]);
        this.drawBonuses();

        SingleplayerMode._players.forEach(player => {
            player.move();
            this.Scene.drawPlayer(player);
        });
        this.Scene.drawPlayerInfo(SingleplayerMode._players);
        
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }
}