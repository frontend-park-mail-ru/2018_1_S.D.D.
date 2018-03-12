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
	 * Use this function if you need special behaviour depended on login state.
	 * 
	 * @param {Function} authCallback Callback if user logged in
	 * @param {Function} noAauthCallback Callback if user not logged in
	 * @param {Function} preCallback Callback to execute before other callbacks
	 * @returns {Promise} Promise without.
	 */
	onAuth(authCallback, noAauthCallback, preCallback = () => {}) {
		return this._ServiceManager.User.loadUser()
			.then(response => {
				preCallback();
				if(this._ServiceManager.ApiService.responseSuccess(response)) {
					authCallback();
				} else {
					noAauthCallback();
				}
			})
			.catch(() => {
				this._ServiceManager.Router.go('/error/503', false);
			});
	}

	getHeaderData() {
		const User = this._ServiceManager.User;
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

export default Model;
