import Composite from './objects/Composite';
import Cell from './objects/field/Cell';
import Field from './objects/field/Field';
import Character from './objects/player/Character';
import { CELL_SIZE } from './settings';

/**
 * Initializes scene.
 *
 * @class
 * @classdesc Contains canvas and game objects.
 */
export default class Scene {
    /**
     * DOM canvas element.
     */
    public static sceneCanvas: HTMLCanvasElement;

    /**
     * Cnvas rendering context.
     */
    public static sceneCanvasContext: CanvasRenderingContext2D;

    /**
     * DOM meta block element.
     */
    public static sceneMetaBlock: HTMLElement;

    /**
     * DOM popup window.
     */
    public static scenePopup: HTMLElement;

    /**
     * Conventional size.
     */
    public static size;

    /**
     * Cells objects.
     */
    public static Field: Composite<Cell>;

    /**
     * Players objects. Includes real players and bots.
     */
    public static Players: Composite<Character>;

    /**
     * Initializes scene
     */
    constructor() {
        if (!Scene.sceneCanvas) {
            Scene.sceneCanvas = document.createElement('canvas'); // just stub
        }
        Scene.sceneCanvasContext = Scene.sceneCanvas.getContext('2d');
        // if (window.devicePixelRatio > 1) {
        //     Scene.sceneCanvasContext.scale(2,2); // Reina display
        // }
        Scene.size = Field.range * CELL_SIZE;
        Scene.Players = new Composite();
    }

    /**
     * Destroy current Scene instance.
     *
     * @returns Null.
     */
    public destroy(): null {
        this.clearObjects();
        Scene.Field = null;
        Scene.Players = null;
        return null;
    }

    /**
     * Adds player on scene.
     *
     * @param Player Player object.
     */
    public addPlayer(Player: Character): void {
        if (!Scene.Players) {
            Scene.Players = new Composite();
        }
        Scene.Players.add(Player);
    }

    /**
     * Draw scene.
     */
    public render(): void {
        Scene.Field.draw();
        Scene.Players.draw();
    }

    /**
     * Delete all objects from scene.
     */
    public clearObjects() {
        if (!Scene.Players) { return; }
        Scene.Players.clear();
    }

    /**
     * Clears canvas.
     */
    public clear(): void {
        Scene.sceneCanvasContext.clearRect(0, 0, Scene.sceneCanvas.width, Scene.sceneCanvas.height);
    }

    /**
     * Game over window.
     */
    public gameOver(): void {
        // TODO
    }
}
