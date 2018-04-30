import Game from './Game';
import { PlayerData } from '../playerdata'
import Player from '../objects/player/Player';
import Bot from '../objects/player/Bot';
import botNames from '../objects/player/botnames';

/**
 * Initializes player, bots.
 * 
 * @class 
 * @classdesc Defines behaviour for singleplayer mode.
 */
export default class SinglePlayer extends Game {
    /**
     * Initializes playe, bots.
     * 
     * @param Data Data of current user.
     */
    constructor(Data: PlayerData) {
        super();
        this.addPlayer(Data);
        this.addBots(Data.name);
    }

    /**
     * Adds player to game
     * 
     * @param Data Player data. Contains nickname and avatar.
     */
    addPlayer(Data: PlayerData): void {
        const nickname = Data.name === '' ? 'Mr. Incognito' : Data.name;
        const Me = new Player(1, nickname);
        this.Scene.addPlayer(Me);
    }

    /**
     * Adds bots to game.
     * 
     * @param PlayerNickname Player nickname. Bot shouldn't have same nickname.
     */
    addBots(PlayerNickname) {
        const namesAmount = botNames.length;
        const divider = namesAmount / 3;

        for (let i = 0; i < 2; i++) {
            let id = Math.floor(Math.random() * ((i + 1) * divider - i * divider)) + i * divider;
            if (id == 0) {
                id++;
            }

            let nickname = botNames[id];
            if (nickname === PlayerNickname ) {
                nickname = id === (i + 1) * divider - 1 ? botNames[id - 1] : botNames[id + 1];
            }
            const Bot = new Bot(id, nickname);
        }
    }
}