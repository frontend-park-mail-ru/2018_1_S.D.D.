import GameView from '../../views/GameView';
import MetaController from './MetaController';
import BonusObject from './objects/bonus/BonusObject';
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
     * Page view.
     */
    public static viewController: GameView;
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
     * Array with possible bonuses.
     */
    public static Bonuses: Composite<BonusObject>;

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
        Scene.Bonuses = new Composite();
        window.addEventListener('resize', () => {
            this.render();
        });
    }

    /**
     * Destroy current Scene instance.
     *
     * @returns True.
     */
    public destroy(): boolean {
        this.clearObjects();
        Scene.Field = null;
        Scene.Players = null;
        return true;
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
        Scene.Bonuses.draw();
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
     *
     * @param places Array with places.
     */
    public gameOver(places: Character[][]): void {
        Scene.viewController.constructGameOver()
        .then(() => {
            MetaController.gameover(Scene.viewController.getGameOverBlock(), places);
            Scene.viewController.showGameOver();
        });
    }
}
