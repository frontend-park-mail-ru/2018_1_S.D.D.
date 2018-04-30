import Composite from './objects/Composite';
import Character from './objects/player/Character';

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
     * Players objects. Includs real players and bots.
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
    }

    /**
     * Adds player on scene.
     * 
     * @param Player Player object.
     */
    addPlayer(Player: Character): void {
        if(!Scene.Players) {
            Scene.Players = new Composite();
        }
        Scene.Players.add(Player);
    }
}