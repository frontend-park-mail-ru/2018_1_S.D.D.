'use strict';

import Model from './Model';

/**
 * Creates instance of ScoresModel
 * 
 * @class
 * @classdesc Scores model. Provide data for template rendering.
 */
class ScoresModel extends Model {
	/**
	 * Creates instance of ScoresModel
	 */
	constructor() {
		super();
		this._usersPerPage = 5;
	}

	getUserCount() {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		API.GET('user/get_users_count').then(response => {
			if (API.responseSuccess(response)) {
				EventBus.emit('showPagination', response.data.count_users);
			} else {
				EventBus.emit('error:noresponse');
			}
		}).catch(() => {
			EventBus.emit('error:noresponse');
		});
	}
	

	/**
	* Get user scores
	*
	* @returns {Object} Object contains user scores
	*/
	getUserScores(page) {
		const limit = this.limit;
		const offset = page * limit - limit;

		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		API.GET(`user/get_users?limit=${limit}&offset=${offset}`).then(response => {
			if (API.responseSuccess(response)) {
				response.data.users_list.userViewList.forEach((user, index) => {
					user.place = offset + index + 1;
				});
				EventBus.emit('showScoresTable', response.data.users_list);
			} else {
				EventBus.emit('error:noresponse');
			}
		}).catch(() => {
			EventBus.emit('error:noresponse');
		});
	}

	get limit() {
		return this._usersPerPage;
	}
}

export default ScoresModel;
