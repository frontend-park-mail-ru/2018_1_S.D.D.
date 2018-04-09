'use strict';

import Controller from './Controller';
import LobbyView from '../views/LobbyView';
import LobbyModel from '../models/LobbyModel';
import SinglePlayer from '../modules/game/controllers/SinglePlayer';
//import MultiPlayer from '../modules/game/controllers/MultiPlayer';
//import LobbyModel from '../models/LobbyModel';

class LobbyController extends Controller {
	constructor() {
		if (LobbyController.__instance) {
			return LobbyController.__instance;
		}
		super();		
		LobbyController.__instance = this;
		
		this.LobbyView = new LobbyView();
		this.LobbyModel = new LobbyModel();
		this.addActions();
		this.subscribeEvents();
	}

	addActions() {
		this.addAction('index', this.actionShowLobbies);
	}

	subscribeEvents() {
		const EventBus = this.ServiceManager.EventBus;
		EventBus.subscribe('showLobbies', this.showLobbies, this);
	}

	actionShowLobbies() {
		this.LobbyModel.getLobbies();
	}

	showLobbies(data) {
		const pageData = {
			'Lobby': data,
		};
		this.LobbyView.constructPage(pageData);
	}

	// showScene() {
	// 	this.GameView.constructPage().then(() => {
	// 		this.game = new SinglePlayer(this.GameView.getScene());
	// 		this.game.startGame();
	// 	});		
	// }
}

export default LobbyController;