import GameView from '../../views/GameView.js';
import ServiceManager from '../ServiceManager';
import Game from './core/Game';
import SinglePlayer from './core/SinglePlayer';
import GameEventBus from './GameEventBus';
import { IPlayerData } from './playerdata';
import Scene from './Scene';
import SessionSettings from './SessionSettings';

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
     * @param metaBlock DOM block on which we will display timer and other info.
     */
    constructor(room: string, View: GameView) {
        Scene.sceneCanvas = View.getScene();
        Scene.sceneMetaBlock = View.getMetaBlock();
        Scene.viewController = View;
        if (SessionSettings.mode === 'offline') {
            this.game = new SinglePlayer();
        } else {
            // Get Other PLayers
            // new MultiPlayer(Me, OtherPlayers);
        }
    }

    /**
     * Destroy current game instance.
     *
     * @returns True;
     */
    public destroy(): boolean {
        GameEventBus.unSubscribeAll();
        if (this.game) {
            return this.game.destroy();
        }
        return true;
    }
}
