import Point from '../objects/Point';
import Game from './Game';
import { PlayerData } from '../playerdata'
import Player from '../objects/player/Player';
import Bot from '../objects/player/Bot';
import Field from '../objects/field/Field';
import Scene from '../Scene'
import InputController from '../InputController';
import { BOTNAMES_MAP, BOTAVATARS_MAP } from '../objects/player/botsettings';

/**
 * Initializes player, bots.
 * 
 * @class 
 * @classdesc Defines behaviour for singleplayer mode.
 */
export default class SinglePlayer extends Game {
    /**
     * Input controller object.
     */
    private IController: InputController;

    /**
     * Initializes playe, bots.
     * 
     * @param Data Data of current user.
     */
    constructor(Data: PlayerData) {
        super();
        this.playerData = Data;
        this.initGame();
    }

    /**
     * Initialize game before start.
     */
    public initGame(): void {
        this.baseInit();
        this.addPlayer(this.playerData);
        this.addBots(this.playerData.name);
        this.start();
    }

    /**
     * Adds player to game
     * 
     * @param Data Player data. Contains nickname and avatar.
     */
    private addPlayer(Data: PlayerData): void {
        const nickname = Data.name === '' ? 'Mr. Incognito' : Data.name;
        const Me = new Player(1, nickname, new Point(0, 0));
        Me.setAvatar(Data.avatar);
        this.Scene.addPlayer(Me);
        this.IController = new InputController(1);
    }

    /**
     * Adds bots to game.
     * 
     * @param PlayerNickname Player nickname. Bot shouldn't have same nickname.
     */
    private addBots(PlayerNickname) {
        const namesAmount = BOTNAMES_MAP.size;
        const divider = namesAmount / 3;

        for (let i = 0; i < 3; i++) {
            let id = Math.floor(Math.random() * ((i + 1) * divider - i * divider)) + i * divider;
            if (id == 0) {
                id++;
            }

            let nickname = BOTNAMES_MAP.get(id + 1);
            let avatar = BOTAVATARS_MAP.get(id + 1);

            const botPosition = new Point(i < 2 ? Field.range - 1 : 0, i > 0 ? Field.range - 1 : 0);

            const Npc = new Bot(i + 2, nickname, botPosition);
            Npc.setAvatar(avatar);
            this.Scene.addPlayer(Npc);
        }
    }

    /**
     * Logic call.
     * 
     * @param lastLogicCall Time spend from last logic call.
     */
    protected logic(lastLogicCall: number): void {
        Scene.Players.do(player => player.move(lastLogicCall));
    }
}