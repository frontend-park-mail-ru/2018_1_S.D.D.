'use strict';

import IMode from './core/Mode';
import SingleplayerMode from './core/Singleplayer';
//import MultiplayerMode from './core/Multiplayer';
import SceneService from './SceneService';

export default class GameManager {
	_Scene: SceneService;
	_mode: IMode;

	constructor(scene: HTMLCanvasElement, room: string) {
		const Scene = new SceneService(scene);
		this._Scene = Scene;

		if (!room || room === '') {
			this._mode = new SingleplayerMode(Scene);
		} else {
			//this._mode = new MultiplayerMode(Scene);
		}

		//this._Scene.drawField();
	}
}