'use strict';

class GameController {
	constructor (scene) {
		this._players = [];
		this.scene = scene;
	}

	/** 
     * Adds new player to game. 
     * 
     * 
     */
	addPlayer (playerSettings) {
		// todo create player
		this._players.push(playerSettings);
	}

	startGame() {
		if (this.scene.getContext) {
			const ctx = this.scene.getContext('2d');
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(300,600);
			ctx.stroke();
		}
	}
}

export default GameController;
