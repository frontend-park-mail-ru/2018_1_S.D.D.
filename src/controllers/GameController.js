'use strict';

import Controller from './Controller';
import GameView from '../views/GameView';
import Game from '../modules/game';

class GameController extends Controller {
	constructor () {
		super();
		if (GameController.__instance) {
			return GameController.__instance;
		}		
		GameController.__instance = this;

		this.GameView = new GameView();
        
		this.addActions();
		this.subscribeEvents();
	}

	addActions() {
		this.addAction('index', this.actionIndex);
	}

	subscribeEvents() {
	}

	actionIndex(room) {
		this.GameView.constructPage().then(() => {
			const scene = this.GameView.getScene();
			this.GameManager = new Game(scene, room);
		});
	}
	
}

export default GameController;