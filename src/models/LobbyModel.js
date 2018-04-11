'use strict';

import Model from './Model';

/**
 * Creates instance of LobbyModel
 * 
 * @class
 * @classdesc Lobby model. Provide data for template rendering.
 */
class LobbyModel extends Model {
	/**
	 * Creates instance of LobbyModel
	 */
	constructor() {
		super();
	}

	getLobbies() {
		const EventBus = this.ServiceManager.EventBus;
		const data = [{'lobbyId': 5, 'countPlayers': 4, 'additionalInfo': 'info'}];
		EventBus.emit('showLobbies', data);
	}
}

export default LobbyModel;
