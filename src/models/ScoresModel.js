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
		const limit = 1;
		const offset = page * limit - limit;

		const API = this._ServiceManager.ApiService;
		const serverResponse = API.GET(`user/get_users?limit=1&offset=${offset}`);
		return serverResponse.then(response => {
			if(API.responseSuccess(response)) {
				onSuccessCallback(response.data);
			} else {
				onErrorCallback();
			}
			return serverResponse;
		}).catch(onErrorCallback());
	}

	getUserScoresCount() {
		return 5;
	}

	getUserScoresTable(onClickCallback) {
		return this.defaultScoresTable = {
			onClick: () => onClickCallback()
		};
	}
}

export default ScoresModel;
