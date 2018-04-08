'use strict';
import GameController from './GameController';

class SinglePlayer extends GameController {
	constructor (scene) {
		super(scene);
		this._players = [];
		//this._Timer = new Timer();
		//this._GameField = new GameField();
	}

	addBot() {

	}

	pauseGame() {

	}

	startGame() {
		super.startGame();
	}

	stopGame() {
        
	}

	countResults() {

	}  
}

export default SinglePlayer;