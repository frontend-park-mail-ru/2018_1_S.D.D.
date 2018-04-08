'use strict';

import Controller from './Controller';
import GameView from '../views/GameView';
import SinglePlayer from '../modules/game/controllers/SinglePlayer';

class GameController extends Controller {
	constructor() {
		super();
		this.GameView = new GameView();
		this.addActions();
		this.game = new SinglePlayer(this.GameView.getScene());
	}

	addActions() {
		this.addAction('index', this.showScene);
	}

	showScene() {
		this.GameView.constructPage();
		this.GameView.showPage();
	}
}

export default GameController;