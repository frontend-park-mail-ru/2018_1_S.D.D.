import ServiceManager from '../ServiceManager';
import Game from './core/Game';
import SinglePlayer from './core/SinglePlayer';
import { IPlayerData } from './playerdata';
import Scene from './Scene';

/**
 * Initialize game. Sets mode.
 *
 * @class
 * @classdesc Entry point. Initialize game. Sets mode (online/offline/multiplayer)
 */
export default class GameInitializer {
    /**
     * Game instance.
     */
    private game: Game;
    /**
     * Sets mode and canvas.
     *
     * @param room Lobby id.
     * @param canvas DOM canvas element.
     */
    constructor(room: string, canvas: HTMLCanvasElement) {
        Scene.sceneCanvas = canvas;
        const User = new ServiceManager().UserStorage;
        const Me: IPlayerData = {
            avatar: User.getData('avatar'),
            name: User.getData('nickname'),
        };

        if (!room || room === '') {
            this.game = new SinglePlayer(Me);
        } else {
            // Get Other PLayers
            // new MultiPlayer(Me, OtherPlayers);
        }
    }

    /**
     * Destroy current game instance.
     *
     * @returns Null;
     */
    public destroy(): null {
        if (this.game) {
            this.game = this.game.destroy();
        }
        return null;
    }
}
