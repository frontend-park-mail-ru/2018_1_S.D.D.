'use strict';

import Controller from './Controller';
import GameView from '../views/GameView';
import SinglePlayer from '../modules/game/controllers/SinglePlayer';

class GameController extends Controller {
	constructor() {
		super();
		this.GameView = new GameView();
		this.addActions();
	}

	addActions() {
		this.addAction('index', this.showScene);
	}

	showScene() {
		this.GameView.constructPage().then(() => {
			this.game = new SinglePlayer(this.GameView.getScene());
			this.game.startGame();
		});		
	}
}

export default GameController;