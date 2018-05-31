import ServiceManager from '../../ServiceManager';
import InputController from '../InputController';
import MetaController from '../MetaController';
import Bonus from '../objects/bonus/BonusObject';
import Field from '../objects/field/Field';
import Bot from '../objects/player/Bot';
import { BOTAVATARS_MAP, BOTNAMES_MAP } from '../objects/player/botsettings';
import { Direction } from '../objects/player/directions';
import Player from '../objects/player/Player';
import Point from '../objects/Point';
import { IPlayerData } from '../playerdata';
import Scene from '../Scene';
import SessionSettings from '../SessionSettings';
import Game from './Game';
import { CELL_SIZE, DIRSTR_MAP } from '../settings';

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

    // counter from 0 to frameTime of last Snap for interpolation
    // 0 is when we are just recieved new snap (start of interpolation)
    // near frameTime when we are ending interpolation and about to recieve new snap
    // this counter is updated in game loop after each rendering
    private interCounter: number;

    private prevServerSnapTime: number;

    /**
     * Initializes playe, bots.
     */
    constructor() {
        super();


        this.prevServerSnapTime = Date.now();
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
        Bus.subscribe('WS:ServerSnapshot', this.refreshGameState, this);
        this.addPlayers();
        MetaController.initPlayersScores(
            Scene.Players.get(),
        );
        this.start();
    }

    public interpolatePlayersOffsets() {

        this.curServerSnap.playersSnap.forEach((player) => {
            const currentPlayer = Scene.Players.item((c) => c.id === player.id);

            const prevSnapPlayer = this.prevServerSnap.playersSnap[player.id-1];
            const curSnapPlayer = this.curServerSnap.playersSnap[player.id-1];

            if (player.id == 1) {
                console.log('prev '+player.id);
                console.log(prevSnapPlayer);
                console.log('cur '+player.id);
                console.log(curSnapPlayer);
            }
            
            const cellDiffX = curSnapPlayer.position.x - prevSnapPlayer.position.x;
            const cellDiffY = curSnapPlayer.position.y - prevSnapPlayer.position.y;
            const cellDiff = CELL_SIZE * (cellDiffX + cellDiffY); // one (and only one) of cellDiffS may be 1, so cellDiff may be 0 or CELL_SIZE

            // TO-DO
            // Probably we should base interpolation
            // not on time spent by server to generate snap (this.curServerSnap.frameTime)
            // but time between recievings of snaps by client
            const interFrameRation = this.interCounter / this.curServerSnap.frameTime;

            // must add cellDiff in case if curPos is very low (~0)
            // (happens when curSnap is on next cell after prevSnap)
            // to prevnt negative value, that may cause reverse moving
            const interFrameMove = curSnapPlayer.offset + cellDiff - prevSnapPlayer.offset;
            
            const interFrameOffset = prevSnapPlayer.offset + interFrameMove * interFrameRation;

            if (player.id == 1) console.log (this.interCounter, this.curServerSnap.frameTime,interFrameRation, interFrameMove, interFrameOffset, cellDiff);

            if (interFrameOffset <= CELL_SIZE) {
                currentPlayer.offsetPlayerByDirection(interFrameOffset, player.direction);
            } else {
                currentPlayer.offsetPlayerByDirection(CELL_SIZE, player.direction);
                currentPlayer.offsetPlayerByDirection(interFrameOffset-CELL_SIZE, player.newDirection);
            }
        });
    }

    // if we recieve a snap from server, where our local newDirection
    // doesnot equal the one from serverSnap, then
    // try send ClientSnapshot
    public sendClientSnapshot(dataPlayers: IPlayerSnap[]) {
        const storage = new ServiceManager().UserStorage;
        const net = new ServiceManager().Net;
        const localPlayer = Scene.Players.item((c) => {
            //console.log(c)
            return c.name === storage.getData('nickname') + " (YOU)";
        });  


        const dataPlayer = dataPlayers[localPlayer.id-1];
        console.log(dataPlayer);
        console.log(DIRSTR_MAP.get(localPlayer.nextDirection) + '-' + dataPlayer.newDirection );

        if (DIRSTR_MAP.get(localPlayer.nextDirection) != dataPlayer.newDirection) {
            const request = {
                class: 'ClientSnapshot',
                direction: localPlayer.nextDirection,
            };
            new ServiceManager().Net.send(request);
        }
        
    }

    public refreshGameState(data: IGameSnapshot) {
        console.log('Time from prev ServSnap: ' + (Date.now() - this.prevServerSnapTime));
        this.prevServerSnapTime = Date.now();

        // Crutch for first serverSnap
        if (this.curServerSnap == null) {
            this.curServerSnap = data;
            return;
        }

        if (data.timestamp > this.curServerSnap.timestamp) {
            this.prevServerSnap = this.curServerSnap;
            this.curServerSnap = data;
            this.interCounter = 0;
        }

        // if we have no snap to start from we shouldnt do anything
        if (this.prevServerSnap == null) {
            return;
        }

        // in terms of interpolation we apdating game by old values
        const field = this.prevServerSnap.gameFieldSnap;
        Game.Field.fillField(field);


        const GamePlayers = Scene.Players;
        const players = this.prevServerSnap.playersSnap.forEach((player) => {
            const currentPlayer = GamePlayers.item((c) => c.id === player.id);
            currentPlayer.score = player.score;
            
            currentPlayer.startPosition = new Point(player.position.x, player.position.y);
            
            currentPlayer.offsetPlayerByDirection(player.offset, player.direction);

            currentPlayer.velocity = player.velocity;
        });
        
        this.sendClientSnapshot(data.playersSnap);

        console.log(data);
        console.log('previousData');
        console.log(this.prevServerSnap);
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
            // if we have something to interpolate
            if (!(this.prevServerSnap == null || this.curServerSnap == null)) {
                this.interpolatePlayersOffsets();
            }

            this.Scene.clear();
            this.Scene.render();

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

            this.interCounter = this.interCounter + (now-this.lastFrameCall);
            console.log('Rendered: ' + (now-this.lastFrameCall));


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
        const storage = new ServiceManager().UserStorage;
        const net = new ServiceManager().Net;
        //console.log(storage.getData('nickname'));
        const currentPlayer = Scene.Players.item((c) => {
            //console.log(c)
            return c.name === storage.getData('nickname') + " (YOU)";
        });      
        const nowTime = Date.now();
        //console.log(currentPlayer);   
        net.send({
            class: "ClientSnapshot",
            direction: null,//currentPlayer.direction,
            velocity: currentPlayer.velocity,
            clientTime: nowTime - this.gameStartTime
        })
        this.gameStartTime = nowTime
        // todo (interpolation?)
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
        const ptoadd1 = new Player(3, 'nickname1', new Point(Field.range - 1, Field.range - 1));
        this.Scene.addPlayer(ptoadd1);
        const ptoadd2 = new Player(4, 'nickname2', new Point(0, Field.range - 1));
        this.Scene.addPlayer(ptoadd2);
    }
}
