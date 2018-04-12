'use strict';

import IMode from './core/Mode';
import SingleplayerMode from './core/Singleplayer';
//import MultiplayerMode from './core/Multiplayer';
import SceneService from './SceneService';
import ServiceManager from '../ServiceManager';

export default class GameManager {
	Scene: SceneService;
	Mode: IMode;

	constructor(scene: HTMLCanvasElement, room: string) {
		const userAvatar = new ServiceManager().UserStorage.getData('avatar');
		this.Scene = new SceneService(scene, userAvatar);

		if (!room || room === '') {
			this.Mode = new SingleplayerMode(this.Scene);
		} else {
			//this._mode = new MultiplayerMode(Scene);
		}
	}
}