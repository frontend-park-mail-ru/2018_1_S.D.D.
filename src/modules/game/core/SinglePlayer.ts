import InputController from '../InputController';
import MetaController from '../MetaController';
import Bonus from '../objects/bonus/BonusObject';
import Field from '../objects/field/Field';
import Bot from '../objects/player/Bot';
import { BOTAVATARS_MAP, BOTNAMES_MAP } from '../objects/player/botsettings';
import Player from '../objects/player/Player';
import Point from '../objects/Point';
import { IPlayerData } from '../playerdata';
import Scene from '../Scene';
import Game from './Game';

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
    constructor(Data: IPlayerData) {
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
        MetaController.initPlayersScores(
            Scene.Players.get(),
        );
        this.start();
    }

    /**
     * Logic call.
     *
     * @param lastLogicCall Time spend from last logic call.
     * @param now Current timestamp.
     */
    protected logic(lastLogicCall: number, now: number): void {
        Scene.Players.do((player) => player.move(lastLogicCall));
        Scene.Bonuses.do((BonusItem) => {
            if (!BonusItem.isActive()) {
                const rC = (min, max) => {
                    const rand = min - 0.5 + Math.random() * (max - min + 1);
                    return Math.round(rand);
                };
                const last = Bonus.lastSpawned;
                if (last === -1 || now - last > 1000) {
                    if (rC(0, 3) == 0) {
                        let spawned = false;
                        while (!spawned) {
                        const bonusPosition = new Point(rC(0, 7), rC(0, 7));
                        const cell = Scene.Field.item((Cell) => {
                            return Cell.position.x === bonusPosition.x &&
                            Cell.position.y === bonusPosition.y;
                        });
                        if (!cell.busy) {
                            cell.busy = true;
                            BonusItem.spawn(bonusPosition);
                            spawned = true;
                        }
                    }
                    }
                    Bonus.lastSpawned = now;
                }
            }
        });
    }

    /**
     * Adds player to game
     *
     * @param Data Player data. Contains nickname and avatar.
     */
    private addPlayer(Data: IPlayerData): void {
        const nickname = Data.name === '' ? 'Mr. Incognito' : Data.name;
        const Me = new Player(1, nickname + ' (YOU)', new Point(0, 0), true);
        this.me = 1;
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
        const namesAmount = BOTNAMES_MAP.size - 1;

        const choosenBots: any[] = [];
        for (let i = 0; i < 3; i++) {
            let choosen = false;
            let id = 0;
            while (!choosen) {
                id = Math.floor(Math.random() * namesAmount);
                if (choosenBots.indexOf(id) === -1) {
                    choosenBots.push(id);
                    choosen = true;
                }
            }

            const nickname = BOTNAMES_MAP.get(id + 2);
            const avatar = BOTAVATARS_MAP.get(id + 2);

            const botPosition = new Point(i < 2 ? Field.range - 1 : 0, i > 0 ? Field.range - 1 : 0);

            const Npc = new Bot(i + 2, nickname, botPosition);
            Npc.setAvatar(avatar);
            this.Scene.addPlayer(Npc);
        }
    }
}
