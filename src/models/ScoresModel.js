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

	getUserCount(onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;
		API.GET('user/get_users_count').then(response => {
			if (API.responseSuccess(response)) {
				onSuccessCallback(response.data.count_users);
			} else {
				onErrorCallback();
			}
		}).catch(() => {
			onErrorCallback();
		});
	}
	

	/**
	* Get user scores
	*
	* @returns {Object} Object contains user scores
	*/
	getUserScores(page, onSuccessCallback, onErrorCallback) {
		const limit = this.limit;
		const offset = page * limit - limit;

		const API = this.ServiceManager.ApiService;
		API.GET(`user/get_users?limit=${limit}&offset=${offset}`).then(responseUsers => {
			if (API.responseSuccess(responseUsers)) {
				responseUsers.data.users_list.userViewList.forEach((user, index) => {
					user.place = offset + index + 1;
				});
				onSuccessCallback(responseUsers.data.users_list);
			} else {
				onErrorCallback();
			}
		}).catch(() => {
			onErrorCallback();
		});
	}

	get limit() {
		return this._usersPerPage;
	}
}

export default ScoresModel;
