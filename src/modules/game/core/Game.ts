import MetaController from '../MetaController';
import Field from '../objects/field/Field';
import { IPlayerData } from '../playerdata';
import Scene from '../Scene';
import { GAME_DURATION } from '../settings';
import Character from '../objects/player/Character';

/**
 * Initializes scene and common game system.
 *
 * @class
 * @classdesc Common behaviour for both multiplayer and singleplayer mode.
 */
export default abstract class Game {
    /**
     * Game status. Do we need proccees logic.
     */
    public running: boolean = false;

    /**
     * ID of current player.
     */
    protected me: number;

    /**
     * Game field. Contains logic for field.
     */
    protected Field: Field;

    /**
     * Scene object. Contains canvas and game objects.
     */
    protected Scene: Scene;

    /**
     * Player data. Contains name and avatar url.
     */
    protected playerData: IPlayerData;

    /**
     * ID of requestAnimationFrame.
     */
    protected gameAnimationLoop: number;

    /**
     * Ingame timer. Seconds until game ended.
     */
    protected timer: number;

    /**
     * Timestamp of last timer changed.
     */
    private lastTimerCall: number;

    /**
     * Timestamp of last requestAnimationFrame was called.
     */
    private lastFrameCall: number;

    /**
     * Initializes scene and common game system.
     */
    constructor() {
        this.Field = new Field();
        this.Scene = new Scene();
        this.Field.initField();
    }

    /**
     * Destroy game instance.
     *
     * @returns True.
     */
    public destroy(): boolean {
        this.pauseAnimationFrame();
        if(this.Scene.destroy()) {
            this.Scene = null;
        }
        if(this.Field.destroy()) {
            this.Field = null;
        }
        return true;
    }

    /**
     * Initialize base components.
     */
    protected baseInit(): void {
        this.timer = GAME_DURATION;
        this.Scene.clearObjects();
    }

    /**
     * Pause redrawing scene.
     */
    protected pauseAnimationFrame(): void {
        window.cancelAnimationFrame(this.gameAnimationLoop);
        this.gameAnimationLoop = undefined;
    }

    /**
     * Resume rendering scene.
     */
    protected resumeAnimationFrame(): void {
        this.gameAnimationLoop = requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Start game. Entry point for game loop.
     */
    protected start(): void {
        MetaController.updateTimer(this.timer);
        if (!this.gameAnimationLoop) {
            const now = performance.now();
            this.lastFrameCall = now;
            this.lastTimerCall = now;
            this.running = true;
            this.gameAnimationLoop = requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /**
     * Redraw scene and call logic.
     *
     * @param now Current timestamp.
     */
    protected gameLoop(now: number): void {
        if (this.gameAnimationLoop) {
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
                this.logic(now - this.lastFrameCall);
            }
            this.lastFrameCall = now;
            this.gameAnimationLoop = requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /**
     * Should be overwritten. Logic call.
     *
     * @param lastLogicCall Time spend from last logic call.
     */
    protected logic(lastLogicCall: number): void {
        // should be overwritten
    }

    /**
     * Get places array: places[place] - array with players.
     * For example, player on 3rd place will placed in places[2];
     */
    protected getPlaces(): Array<Array<Character>> {
        const places: Array<Array<Character>> = [];
        const players = Scene.Players.get();
        players.sort((a, b) => b.score - a.score);
        let currentPlace = -1;
        let currentScore = -1;
        players.forEach(player => {
            if (player.score < currentScore || currentScore === -1) {
                currentScore = player.score;
                currentPlace++;
                places[currentPlace] = [];
            }
            places[currentPlace].push(player)
        });
        return places;
    }

    protected gameOver() {
        this.running = false;
        this.pauseAnimationFrame();
        this.Scene.gameOver(this.getPlaces());
    }
}
