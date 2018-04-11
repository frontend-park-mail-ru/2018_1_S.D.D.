'use strict';

import IMode from './core/IMode';
import SingleplayerMode from './core/Singleplayer';
import MultiplayerMode from './core/Multiplayer';
import SceneService from './core/SceneService';

export default class GameManager {
	_Scene: SceneService;
	_mode: IMode;

	constructor(scene: HTMLCanvasElement, room: string) {
		this._Scene = new SceneService(scene);

		if (!room || room === '') {
			this._mode = new SingleplayerMode();
		} else {
			this._mode = new MultiplayerMode();
		}

		this._Scene.clear();
	}
}