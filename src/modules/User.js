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
		return serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				const data = response.data;
				this._avatar = data.avatar;
				this._nickname = data.nickname;
				this._email = data.email;
				this._rating = data.rating;
				this._loggedIn = true;
			}
			return serverResponse;
		});
	}

	/**
	 * Try to login user with login and password.
	 * 
	 * @param {Object} data Login and password.
	 * @returns {Promise} Server response.
	 */
	login(data) {
		const serverResponse = this._API.POST('user/signin', data);
		return serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				this._loggedIn = true;
				return this.loadUser();
			} else {
				return serverResponse;
			}
		}).catch(() => {});
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
		const serverResponse = this._API.POST('user/signout');
		return serverResponse.then(() => {
			this._avatar = null;
			this._nickname = null;
			this._email = null;
			this._rating = null;
			this._loggedIn = false;
			return serverResponse;
		});
	}

	get nickname() {
		return this._nickname;
	}

	get avatar() {
		return this._avatar;
	}

	get defaultAvatar() {
		return this._avatar == null ? true : false;
	}

	get email() {
		return this._email;
	}

	get rating() {
		return this._rating;
	}

}

export default User;
