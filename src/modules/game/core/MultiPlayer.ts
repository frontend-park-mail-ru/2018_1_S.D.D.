import ServiceManager from '../../ServiceManager';
import InputController from '../InputController';
import MetaController from '../MetaController';
import Bonus from '../objects/bonus/BonusObject';
import Field from '../objects/field/Field';
import Bot from '../objects/player/Bot';
import { BOTAVATARS_MAP, BOTNAMES_MAP } from '../objects/player/botsettings';
import Character from '../objects/player/Character';
import { Direction } from '../objects/player/directions';
import Player from '../objects/player/Player';
import Point from '../objects/Point';
import { IPlayerData } from '../playerdata';
import Scene from '../Scene';
import SessionSettings from '../SessionSettings';
import { CELL_SIZE, DIRSTR_MAP } from '../settings';
import Game from './Game';

interface IFieldSnap {
    field: number[][];
}

interface ICoordinates {
    x: number;
    y: number;
}

interface IPlayerSnap {
    position: ICoordinates;
    direction: string;
    score: number;
    id: number;
    velocity: number;
    newDirection: string;
    offset: number;
}

interface IGameSnapshot {
    class: number;
    frameTime: number;
    timestamp: number;
    gameFieldSnap: IFieldSnap;
    playersSnap: IPlayerSnap[];
}

interface IGameSnapSave {
    recievingTimestamp: number;
    gameSnapshot: IGameSnapshot;
}

/**
 * Initializes player.
 *
 * @class
 * @classdesc Defines behaviour for mutiplayer mode.
 */
export default class Multiplayer extends Game {
    /**
     * Input controller object.
     */
    private IController: InputController;
    private gameStartTime: number;

    private prevServerSnap: IGameSnapshot;
    private curServerSnap: IGameSnapshot;

    private gameSnapSaves: IGameSnapSave[];

    private lastSnapRecieveTimestamp: number;
    private currentTimestamp: number;

    private prevOffset: number;

    /**
     * counter from 0 to frameTime of last Snap for interpolation
     * 0 is when we are just recieved new snap (start of interpolation)
     * near frameTime when we are ending interpolation and about to recieve new snap
     * this counter is updated in game loop after each rendering
     */
    private interCounter: number;

    /**
     * Time of receiveing last serverSnapshots
     */
    private prevServerSnapTime: number;

    /**
     * Time between
     */
    private serverSnapTimeDiff: number;

    /**
     * Initializes playe, bots.
     */
    constructor() {
        super();

        this.prevServerSnapTime = Date.now();
        this.gameSnapSaves = [];
        this.serverSnapTimeDiff = 0;
        this.prevOffset = 0;
        this.playerData = SessionSettings.players[0];
        this.initGame();
    }

    /**
     * Initialize game before start.
     */
    public initGame(): void {
        this.baseInit();
        this.gameStartTime = Date.now();
        const Bus = new ServiceManager().EventBus;
        Bus.subscribe('WS:ServerSnapshot', this.serverSnapHandler, this);
        this.addPlayers();
        MetaController.initPlayersScores(
            Scene.Players.get(),
        );
        this.start();
    }

    /**
     * Players interpolation between last available and previous serverSnapshots
     * based on time between their receiving
     * @param prevSnap starting snap to interpolate
     * @param curSnap finishing snap to interpolate
     * @param ratio interpolation ratio
     */
    public interpolatePlayersOffsetsBetween(prevSnap: IGameSnapshot, curSnap: IGameSnapshot, ratio: number) {
        prevSnap.playersSnap.forEach((prevSnapPlayer) => {
            const ScenePlayerToInterpolate = Scene.Players.item((c) => c.id === prevSnapPlayer.id);

            const curSnapPlayer = curSnap.playersSnap[prevSnapPlayer.id - 1];

            const cellDiffX = Math.abs(curSnapPlayer.position.x - prevSnapPlayer.position.x);
            const cellDiffY = Math.abs(curSnapPlayer.position.y - prevSnapPlayer.position.y);
            // one (and only one) of cellDiffS may be 1, so cellDiff may be 0 or CELL_SIZE
            const cellDiff = CELL_SIZE * (cellDiffX + cellDiffY);

            // must add cellDiff in case if curPos is very low (~0)
            // (happens when curSnap is on next cell after prevSnap)
            // to prevnt negative value, that may cause reverse moving
            const interFrameMove = curSnapPlayer.offset + cellDiff - prevSnapPlayer.offset;

            let interFrameOffset = prevSnapPlayer.offset + interFrameMove * ratio;

            if (interFrameOffset < this.prevOffset && Math.abs(interFrameOffset-this.prevOffset) < 50) {
                interFrameOffset = this.prevOffset+1;
            } 
            this.prevOffset = interFrameOffset;

            // if interpolation jumps out of cell, then we have to make additional offset
            // using direction of curSnap (the last snapshot of interpolation)
            if (interFrameOffset <= CELL_SIZE) {
                ScenePlayerToInterpolate.offsetPlayerByDirection(interFrameOffset, prevSnapPlayer.direction);
            } else {
                ScenePlayerToInterpolate.offsetPlayerByDirection(CELL_SIZE, prevSnapPlayer.direction);
                ScenePlayerToInterpolate.offsetPlayerByDirectionAdditive(interFrameOffset - CELL_SIZE, curSnapPlayer.direction);
            }
        });
    }

    /**
     * Players interpolation between last available and previous serverSnapshots
     * based on time between their receiving
     */
    public interpolatePlayersOffsets() {

        this.prevServerSnap.playersSnap.forEach((prevSnapPlayer) => {
            const ScenePlayerToInterpolate = Scene.Players.item((c) => c.id === prevSnapPlayer.id);

            const curSnapPlayer = this.curServerSnap.playersSnap[prevSnapPlayer.id - 1];

            const cellDiffX = Math.abs(curSnapPlayer.position.x - prevSnapPlayer.position.x);
            const cellDiffY = Math.abs(curSnapPlayer.position.y - prevSnapPlayer.position.y);
            // one (and only one) of cellDiffS may be 1, so cellDiff may be 0 or CELL_SIZE
            const cellDiff = CELL_SIZE * (cellDiffX + cellDiffY);

            // must add cellDiff in case if curPos is very low (~0)
            // (happens when curSnap is on next cell after prevSnap)
            // to prevnt negative value, that may cause reverse moving
            const interFrameMove = curSnapPlayer.offset + cellDiff - prevSnapPlayer.offset;

            const interFrameRation = this.interCounter / this.serverSnapTimeDiff;

            const interFrameOffset = prevSnapPlayer.offset + interFrameMove * interFrameRation;

            if (interFrameOffset <= CELL_SIZE) {
                ScenePlayerToInterpolate.offsetPlayerByDirection(interFrameOffset, prevSnapPlayer.direction);
            } else {
                ScenePlayerToInterpolate.offsetPlayerByDirection(CELL_SIZE, prevSnapPlayer.direction);
                ScenePlayerToInterpolate.offsetPlayerByDirectionAdditive(interFrameOffset - CELL_SIZE, curSnapPlayer.direction);
            }
        });
    }

    /**
     * Low-level func to send server local player's snapshot.
     *
     * @param localPlayer info about local player
     */
    private _sendClientSnap(localPlayer: Character) {
        const net = new ServiceManager().Net;

        const nowTime = Date.now();
        net.send({
            class: 'ClientSnapshot',
            clientTime: nowTime - this.gameStartTime,
            direction: DIRSTR_MAP.get(localPlayer.nextDirection),
            velocity: localPlayer.velocity,
        });

        this.gameStartTime = nowTime;
    }

    /**
     * Sending client snapshot.
     *
     * @param dataPlayers info about players from serverSnapshot/
     * Used to check if server has valid newDirection of local player.
     * If null - forced sending without checking.
     */
    public sendClientSnapshot(dataPlayers: IPlayerSnap[]) {
        const localPlayer = Scene.Players.item((c) => {
            return c.isCurrentPlayer;
        });

        // null means force send and end of func
        if (dataPlayers == null) {
            return this._sendClientSnap(localPlayer);
        }

        // here not forced send if there is diff between serverSnap and local dir
        const dataPlayer = dataPlayers[localPlayer.id - 1];
        if (DIRSTR_MAP.get(localPlayer.nextDirection) !== dataPlayer.newDirection) {
            this._sendClientSnap(localPlayer);
        }
    }

    /**
     * Apdating local game info with data from server
     *
     * @param data serverSnapshot to take info from
     */
    public refreshGameState(data: IGameSnapshot) {
        const field = data.gameFieldSnap;
        Game.Field.fillField(field);

        const GamePlayers = Scene.Players;
        const players = data.playersSnap.forEach((player) => {
            const currentPlayer = GamePlayers.item((c) => c.id === player.id);
            currentPlayer.score = player.score;

            const x = player.position.x;
            const y = player.position.y;

            currentPlayer.startPosition.x = x;
            currentPlayer.startPosition.y = y;

            currentPlayer.velocity = player.velocity;
        });
        MetaController.updateScores();
    }

    /**
     * Handler of incoming serverSnapshots
     *
     * @param data serverSnapshot to handle.
     */
    public serverSnapHandler(data: IGameSnapshot) {
        this.lastSnapRecieveTimestamp = Date.now();

        if (this.gameSnapSaves.length == 0) {
            this.currentTimestamp = this.lastSnapRecieveTimestamp;

            this.gameSnapSaves.push({
                recievingTimestamp: this.lastSnapRecieveTimestamp,
                gameSnapshot: data,
            });
        }

        // if new timestamp is newer that last recieved, than add it
        if (data.timestamp >= this.gameSnapSaves[this.gameSnapSaves.length - 1].gameSnapshot.timestamp) {
            this.gameSnapSaves.push({
                recievingTimestamp: this.lastSnapRecieveTimestamp,
                gameSnapshot: data,
            });

            this.interCounter = 0;
        }

        /* OLD INTERPOLATION
        this.serverSnapTimeDiff = Date.now() - this.prevServerSnapTime;
        this.prevServerSnapTime = Date.now();

        // Crutch for first serverSnap
        if (this.curServerSnap == null) {
            this.prevServerSnap = data;
            this.curServerSnap = data;
        }

        if (data.timestamp > this.curServerSnap.timestamp) {
            this.prevServerSnap = this.curServerSnap;
            this.curServerSnap = data;
            this.interCounter = 0;
        }

        // in terms of interpolation we apdating game by old values
        this.refreshGameState(this.prevServerSnap);
        */
    }

    /**
     * May be overwritten. draw call.
     *
     * Redraw scene and call logic.
     *
     * @param now Current timestamp.
     */
    protected gameLoop(now: number): void {
        if (this.gameAnimationLoop) {

            /* OLD INTERPOLATION
            // if we have something to interpolate
            if (!(this.prevServerSnap == null || this.curServerSnap == null)) {
                this.interpolatePlayersOffsets();
            }
            */
            if (this.timer === 0) {
                this.gameOver();
                return;
            }

            if (now - this.lastTimerCall >= 1000) {
                if (this.running) {
                    this.timer--;
                    MetaController.updateTimer(this.timer);
                }
                this.lastTimerCall = this.lastTimerCall + 1000; // not now coz maybe more
            }

            if (this.running) {
                this.logic(now - this.lastFrameCall, now);
            }

            this.interCounter = this.interCounter + (now - this.lastFrameCall);

            this.Scene.clear();
            this.Scene.render();

            this.lastFrameCall = now;
            this.gameAnimationLoop = requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /**
     * Logic call.
     *
     * @param lastLogicCall Time spend from last logic call.
     * @param now Current timestamp.
     */
    protected logic(lastLogicCall: number, now: number): void {
        this.sendClientSnapshot(null);

        // ToDo Probably its beter to switch serverTime on clientReceivingTime

        if (this.gameSnapSaves.length < 2) {return; }
        // 1) Find ration of interCounter to Length of Last Snap FrameTime
        const lastSaveIndex = this.gameSnapSaves.length - 1;
        const newestSnap = this.gameSnapSaves[lastSaveIndex];
        const interCounterToLastSnapRation = this.interCounter / newestSnap.gameSnapshot.frameTime;

        // 2) Find serverTime, corresponding to ration between LastSnap and OldestSnap
        const oldestSnap = this.gameSnapSaves[0];
        const oldestSnapClientTime = oldestSnap.recievingTimestamp;
        const newestSnapClientTime = newestSnap.recievingTimestamp;
        const clientTime = oldestSnapClientTime + (newestSnapClientTime-oldestSnapClientTime)*interCounterToLastSnapRation;
        console.log('ct',this.gameSnapSaves.length);

        // 3) Drop all snapshots, that are too old (by serverTime)
        // That means that there must remain only one Snap before serverTime
        // and second elem is first higher then serverTime
        while ((this.gameSnapSaves.length > 2) && (this.gameSnapSaves[1].recievingTimestamp < clientTime)) {
            this.gameSnapSaves.shift();
        }
        console.log('dt',this.gameSnapSaves.length);
        // 4) Applay newOldestSnap to current game with ration of serverTime to newestSnap
        const newOldestSnap = this.gameSnapSaves[0];
        const newOldestSnapClientTime = newOldestSnap.recievingTimestamp;
        const clientTimeToNewestSnapRatio = (clientTime-newOldestSnapClientTime)/(newestSnapClientTime-newOldestSnapClientTime);
        console.log('rat st pst nst', clientTimeToNewestSnapRatio, clientTime, newOldestSnapClientTime, newestSnapClientTime);
        // 4.1) Updating game field with newOldestSnap in terms of interpolation
        this.refreshGameState(newOldestSnap.gameSnapshot);
        // 4.2) Intorpolate Players between newOldestSnap and newestSnap with serverTimeToNewestSnapRatio
        console.log('interpole',newOldestSnap, newestSnap, clientTimeToNewestSnapRatio);
        this.interpolatePlayersOffsetsBetween(newOldestSnap.gameSnapshot, newestSnap.gameSnapshot, clientTimeToNewestSnapRatio);
    }

    /**
     * Adds player to game
     *
     * @param Data Player data. Contains nickname and avatar.
     */
    private addPlayers(): void {
        const me = new ServiceManager().UserStorage.getData('nickname');
        SessionSettings.players.forEach((player, index) => {
            let nickname = player.name;
            if (me === nickname) {
                nickname += ' (YOU)';
                this.IController = new InputController(player.id);
                this.me = player.id;
            }
            const x = (index === 1 || index === 4) ? 0 : Field.range - 1;
            const y = index <= 2 ? 0 : Field.range - 1;

            const ptoadd = new Player(player.id, nickname, new Point(x, y), this.me === player.id);
            ptoadd.setAvatar(player.avatar);
            this.Scene.addPlayer(ptoadd);
        });
        // const ptoadd1 = new Player(3, 'nickname1', new Point(Field.range - 1, Field.range - 1));
        // this.Scene.addPlayer(ptoadd1);
        // const ptoadd2 = new Player(4, 'nickname2', new Point(0, Field.range - 1));
        // this.Scene.addPlayer(ptoadd2);
    }
}
