'use strict';
import Game from './Game';

class SinglePlayer extends Game {
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