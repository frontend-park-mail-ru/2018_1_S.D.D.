import MetaController from '../MetaController';
import Field from '../objects/field/Field';
import { IPlayerData } from '../playerdata';
import Scene from '../Scene';
import { GAME_DURATION } from '../settings';

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
     * @returns Null.
     */
    public destroy(): null {
        this.pauseAnimationFrame();
        this.Scene = this.Scene.destroy();
        this.Field = this.Field.destroy();
        return null;
    }

    /**
     * Initialize base components.
     */
    protected baseInit(): void {
        this.timer = GAME_DURATION;
        this.Scene.clearObjects();
    }

    /**
     * Pause redrawing scene. Also pause logic loop.
     */
    protected pauseAnimationFrame(): void {
        window.cancelAnimationFrame(this.gameAnimationLoop);
        this.gameAnimationLoop = undefined;
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
            if (this.timer === 0) {
                this.gameOver();
            }

            if (now - this.lastTimerCall >= 1000) {
                if (this.running) {
                    this.timer--;
                    MetaController.updateTimer(this.timer);
                }
                this.lastTimerCall = this.lastTimerCall + 1000; // not now coz maybe more
            }

            this.Scene.clear();
            this.Scene.render();

            if (this.running) {
                this.logic(now - this.lastFrameCall);
            }
            this.lastFrameCall = now;
        }

        this.gameAnimationLoop = requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Should be overwritten. Logic call.
     *
     * @param lastLogicCall Time spend from last logic call.
     */
    protected logic(lastLogicCall: number): void {
        // should be overwritten
    }

    protected gameOver() {
        this.running = false;
        this.Scene.gameOver();
    }
}
