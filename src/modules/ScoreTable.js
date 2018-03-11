'use strict';

import ServiceManager from './ServiceManager';

/**
 * Creates instance of ScoresTable
 * 
 * @class
 * @classdesc ScoresTable holder. 
 */
class ScoresTable {
	/**
	 * Creates instance of User
	 */
	constructor() {
		this._SM = new ServiceManager();
		this._API = this._SM.ApiService;
		this._Router = this._SM.Router;
	}


	/**
	 * Get users info for score table
	 * 
	 * @returns {Promise} Server response.
	 */
	loadUsers(data) {
		const serverResponse = this._API.GET('user/get_users',data);
		return serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				const data = response.data;
				return data;
			}
			return serverResponse;
		});
	}

}

export default ScoresTable;