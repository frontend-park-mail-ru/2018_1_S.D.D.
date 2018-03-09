'use strict';

import ServiceManager from './ServiceManager';

/**
 * Creates instance of User
 * 
 * @class
 * @classdesc User holder. Provide access to user data.
 */
class User {
	/**
	 * Creates instance of User
	 */
	constructor() {
		this._SM = new ServiceManager();
		this._API = this._SM.ApiService;
		this._Router = this._SM.Router;
		this._loggedIn = false;
	}

	/**
	 * Checks if user is logined or not.
	 * 
	 * @returns {boolean} True if user logined, false if he isn't.
	 */
	isLogged() {
		return this._loggedIn;
	}

	/**
	 * Get user info from server if user logged in.
	 * 
	 * @returns {Promise} Server response.
	 */
	loadUser() {
		const serverResponse = this._API.GET('user/info');
		serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				this._avatar = 'src/from/response.jpg';
				this._loggedIn = true;
				//etc
			}
		}).catch(() => {});
		return serverResponse;
	}

	/**
	 * Try to login user with login and password.
	 * 
	 * @param {Object} data Login and password.
	 * @returns {Promise} Server response.
	 */
	login(data) {
		const serverResponse = this._API.POST('user/signin', data);
		serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				this._loggedIn = true;
				this.loadUser().catch(() => {});
			}
		}).catch(() => {});
		return serverResponse;
	}

	/**
	 * Signup user with incoming data.
	 * 
	 * @param {Object} data Login and password.
	 * @returns {Promise} Server response.
	 */
	signup(data) {
		return this._API.POST('user/signup', data);
	}

	logout() {

	}

}

export default User;
