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
	getUserScores(onClickCallback) {

		const API = this._ServiceManager.ApiService;
		const serverResponse = API.GET('user/get_users');
		if (serverResponse) {
			return serverResponse.then(response => {
				if(API.responseSuccess(response)) {
					const data = response.data;
					data.onClick = onClickCallback;
					return data;
				}
				serverResponse.onClick = onClickCallback;
				return serverResponse;
			});
		} 
		/*return {
			"errors": {},
			"data": {
			"userViewList": [
				{
					"nickname": "da2",
					"email": "emao@emai1111111dd111122.cd",
					"rating": 2.4,
					"avatar": null
				},
				{
					"nickname": "dat2",
					"email": "emao@emai1111111dd1111212.cd",
					"rating": 0.08888888888888889,
					"avatar": null
				}
			],
			"size": 2
			}
		}*/

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
