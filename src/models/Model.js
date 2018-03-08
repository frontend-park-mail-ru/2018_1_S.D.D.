'use strict';

import ServiceManager from '../modules/ServiceManager';

/**
 * Creates instance of Model
 * 
 * @class
 * @classdesc Base model. Provide acces to ServiceManager.
 */
class Model {
	/**
	 * Creates instance of Model
	 */
	constructor() {
		this._ServiceManager = new ServiceManager();
	}

	/**
	 * Checks if operation was success or not.
	 * 
	 * @param {Object} response Data recived from server.
	 * @returns {boolean} True if success, false in other case.
	 */
	responseSuccess(response) {
		const errorsList = response.errors;
		if (errorsList) {
			for (var error in errorsList) {
				if (errorsList.hasOwnProperty(error)) {
					return false;
				}
			}
		}
		return true;
	}
}

export default Model;
