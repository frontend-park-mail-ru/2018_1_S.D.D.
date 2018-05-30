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

    /**
     * Initializes playe, bots.
     */
    constructor() {
        super();
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

    public refreshGameState(data: IGameSnapshot) {
        const field = data.gameFieldSnap;
        Game.Field.fillField(field);

        const GamePlayers = Scene.Players;
        const players = data.playersSnap.forEach((player) => {
            const currentPlayer = GamePlayers.item((c) => c.id === player.id);
            currentPlayer.score = player.score;
            currentPlayer.startPosition = new Point(player.position.x, player.position.y);
            currentPlayer.clearOffset = player.offset;
            switch (player.direction) {
                case 'LEFT':
                    //currentPlayer.direction = Direction.LEFT;
                    currentPlayer.moveOffset.x = -player.offset;
                    break;
                case 'RIGHT':
                    //currentPlayer.direction = Direction.RIGHT;
                    currentPlayer.moveOffset.x = player.offset;
                    break;
                case 'UP':
                   // currentPlayer.direction = Direction.UP;
                    currentPlayer.moveOffset.y = -player.offset;
                    break;
                case 'DOWN':
                    //currentPlayer.direction = Direction.DOWN;
                    currentPlayer.moveOffset.y = player.offset;
                    break;
            }
            currentPlayer.velocity = player.velocity;
        });
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
