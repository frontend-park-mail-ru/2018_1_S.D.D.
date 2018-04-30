import Scene from '../Scene';

/**
 * Initializes scene and common game system.
 * 
 * @class
 * @classdesc Common behaviour for both multiplayer and singleplayer mode.
 */
export default abstract class Game {
    /**
     * Scene object. Contains canvas and game objects.
     */
    protected Scene: Scene;

    /**
     * Initializes scene and common game system.
     */
    constructor() {
        this.Scene = new Scene();
    }
}