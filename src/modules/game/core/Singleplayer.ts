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
import StackBonus from '../bonus/StackEnemiesBonus';
import ColorRowBonus from '../bonus/ColorRowBonus';
import Point from '../Point';
import BonusObject from '../bonus/BonusObject';

export default class SingleplayerMode extends Mode {
    private tickDelay: number;
    private Scene: Scene;
    private gameLoopReqId: number;

    public SlownessBonus: SlownessBonus;
    public StackBonus: StackBonus;
    public ColorRowBonus: ColorRowBonus;
    public Bonuses: Array<BonusObject> = [];
    public ticks: number = 0;

    public started: boolean = false;
    public paused: boolean = false;
    public over: boolean = false;

    constructor (Scene: Scene, Users: Array<any>, gameFieldRange: number = 8, ticksInSecond: number = 2000) {
        super(gameFieldRange);

        this.Scene = Scene;
        this.tickDelay = 1000/ticksInSecond;

        this.Bonuses.push(new SlownessBonus());
        this.Bonuses.push(new StackBonus());
        this.Bonuses.push(new ColorRowBonus());
        this.init(Users);
    }

    private init(Users: Array<any>): void {
        window.cancelAnimationFrame(this.gameLoopReqId);
        this.gameLoopReqId = undefined;
        this.ticks = 0;
        this.over = false;
        SingleplayerMode._GameField.init(this.gameFieldRange);
        SingleplayerMode._players.splice(0, SingleplayerMode._players.length)
        this.addPlayer(new Player(1, 'YOU', Users[0]));
        this.addPlayer(new Bot(2, BOT_NAMES[0]));
        this.addPlayer(new Bot(3, BOT_NAMES[1]));
        this.addPlayer(new Bot(4, BOT_NAMES[2]));

        const Bus = GameEventBus;
        
        Bus.unSubscribeAll().then(() => {
            Bus.subscribe('PRESSED:SPACE', this.launchGame, this);
            Bus.subscribe('GAMEOVER', this.gameOver, this);
            Bus.subscribe('START', () => { this.startGame(); }, this);
            Bus.subscribe('RESTART', () => { this.init(Users); }, this);
        });

        this.Scene.re();
        this.Scene.awaitScreen();
    }

    public addPlayer(player: Player): void {
        SingleplayerMode._players.push(player);
    }

    startGame(): void {
        if(!this.gameLoopReqId) {
            this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
        }
    }

    private logic() {
        this.ticks++;
        SingleplayerMode._players.forEach(player => {
            player.move();
        });
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
        });
    }

    private gameModelTick(): void {
        const Bus = GameEventBus;
        if (this.ticks >= 3000) {
            Bus.emit('GAMEOVER');
        }
        
        if (this.gameLoopReqId) {
            this.Scene.clear();
            this.Scene.drawField(SingleplayerMode._GameField.getGameMatrix());
            this.Bonuses.forEach(Bonus => {
                this.Scene.drawBonus(Bonus);
            });
            SingleplayerMode._players.forEach(player => {
                this.Scene.drawPlayer(player);
            });
            this.Scene.drawPlayerInfo(SingleplayerMode._players, 60 - Math.round(this.ticks / 50));
            
            if (this.started && !this.paused) {
                setTimeout(() => {
                    this.logic();
                });
            } else {
                if (this.over) {
                    this.Scene.gameOverScreen(SingleplayerMode._players);
                }
    
                if (this.paused) {
                    this.Scene.pauseScreen();
                }
            }
        }
        
        this.gameLoopReqId = requestAnimationFrame(this.gameModelTick.bind(this));
    }

    private launchGame(): void {
        if (this.over) {
            const Bus = GameEventBus;
            Bus.emit('RESTART');
        } else {
            if (!this.started) {
                this.started = true;
                this.Scene.prepareScreen();
            } else {
                if (!this.paused) {
                    this.paused = true;
                } else {
                    this.paused = false;
                }
            }
        }
    }

    private gameOver(): void {
        this.started = false;
        this.over = true;
    }
}