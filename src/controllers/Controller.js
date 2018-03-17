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
		this.ServiceManager = new ServiceManager();
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
	 * @param {string[]} parameters Parameters for action.
	 * @returns {boolean} True if action executed. False if bot found (404).
	 */
	action(action, parameters = []) {
		const callback = this._actions[action];
		if(!callback) {
			return false;
		}
		callback(parameters);
		return true;
	}

	/**
	 * Load new page.
	 * 
	 * @param {string} url Page url.
	 */
	go(url, history = true) {
		this.ServiceManager.Router.go(url, history);
	}

	/**
	 * Get data for header rendering
	 */
	getHeaderData() {
		const User = this.ServiceManager.UserStorage;
		
		return {
			loggedIn: User.isLogged(),
			nickname: User.nickname,
			defaultAvatar: User.defaultAvatar,
			avatar: User.avatar,
			menuItems: [
				{ link:'/user/profile', text:'PROFILE' },
				{ link:'/user/settings', text:'SETTINGS' },
				{ link:'/user/logout', text:'LOG OUT', nohistory: 'true' }
			]
		};
	}
}

export default Controller;
