'use strict';

import ServiceManager from '../modules/ServiceManager';

/** 
 * @class
 * @classdesc Base controller class. Defined actionIndex method.
*/
class Controller {
	/**
	 * Creates instance if Controller
	 */
	constructor() {
		this._ServiceManager = new ServiceManager();
		this._actions = {
			index: () => {},
			close: () => {}
		};
	}

	/**
	 * 
	 * @param {string} action Action name.
	 * @param {Function} callback Function to call.
	 */
	addAction(action, callback) {
		this._actions[action] = callback.bind(this);
	}

	/**
	 * Searches for action and executes it.
	 * 
	 * @param {string} action Action name.
	 * @returns {boolean} True if action executed. False if bot found (404).
	 */
	action(action) {
		const callback = this._actions[action];
		if(!callback) {
			return false;
		}
		callback();
		return true;
	}

	/**
	 * Load new page.
	 * 
	 * @param {string} url Page url.
	 */
	go(url, history = true) {
		this._ServiceManager.Router.go(url, history);
	}
}

export default Controller;
