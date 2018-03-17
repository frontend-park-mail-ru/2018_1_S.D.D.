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
	}
	

	/**
	* Get user scores
	*
	* @returns {Object} Object contains user scores
	*/
	getUserScores(page, onSuccessCallback, onErrorCallback) {
		const limit = 5;
		const offset = page * limit - limit;

		const API = this.ServiceManager.ApiService;
		API.GET(`user/get_users?limit=${limit}&offset=${offset}`).then(response => {
			if(API.responseSuccess(response)) {
				onSuccessCallback(response.data);
			} else {
				onErrorCallback();
			}
		}).catch(() => {
			onErrorCallback();
		});
	}
}

export default ScoresModel;
