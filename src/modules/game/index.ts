import ServiceManager from '../ServiceManager';
import { PlayerData } from './playerdata';
import SinglePlayer from './core/SinglePlayer';
import Scene from './Scene';

/**
 * Initialize game. Sets mode.
 * 
 * @class 
 * @classdesc Entry point. Initialize game. Sets mode (online/offline/multiplayer)
 */
export default class GameInitializer {
    /**
     * Sets mode and canvas.
     * 
     * @param room Lobby id.
     * @param canvas DOM canvas element.
     */
    constructor(room: string, canvas: HTMLCanvasElement) {
        Scene.sceneCanvas = canvas;
        const User = new ServiceManager().UserStorage;
        const Me: PlayerData = {
            name: User.getData('nickname'),
            avatar: User.getData('avatar')
        };

        if (!room || room === '') {
            new SinglePlayer(Me);
        } else {
            // Get Other PLayers
            //new MultiPlayer(Me, OtherPlayers);
        }
    }
}