import Scene from '../Scene';
import Field from '../objects/field/Field';
import { PlayerData } from '../playerdata'

/**
 * Initializes scene and common game system.
 * 
 * @class
 * @classdesc Common behaviour for both multiplayer and singleplayer mode.
 */
export default abstract class Game {
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
    protected playerData: PlayerData;

    /**
     * ID of requestAnimationFrame.
     */
    protected gameAnimationLoop: number;

    /**
     * Tick number (number of frames were drawed after game started).
     */
    protected tick: number;

    /**
     * Ingame timer. Seconds until game ended.
     */
    protected timer: number;

    /**
     * Timestamp of last timer changed.
     */
    private lastTimerCall: number;

    /**
     * Initializes scene and common game system.
     */
    constructor() {
        this.Scene = new Scene();
        this.Field = new Field();
    }

    /**
     * Initialize base components.
     */
    protected baseInit(): void {
        this.tick = 0;
        this.timer = 60;
        this.Scene.clearObjects();
    }

    /**
     * Pause redrawing scene. Also pause login loop.
     */
    protected pauseAnimationFrame(): void {
        window.cancelAnimationFrame(this.gameAnimationLoop);
    }

    /**
     * Start game. Entry point for game loop.
     */
    protected start(): void {
        if (!this.gameAnimationLoop) {
            this.gameAnimationLoop = requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /**
     * Redraw scene and call logic.
     * 
     * @param now Current timestamp.
     */
    protected gameLoop(now: number): void {
        if (this.timer == 0) {
            this.gameOver();
        }

        if (now - this.lastTimerCall >= 1000) {
            this.timer--;
            this.lastTimerCall = now;
        }

        this.Scene.clear();
        this.Scene.render();

        this.logic();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    protected logic(): void {
        // should be overwritten
    }

    protected gameOver() {

    }
}