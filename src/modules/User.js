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
	 * Set data to null and loggedIn value into false.
	 */
	reset() {
		this._avatar = null;
		this._nickname = null;
		this._email = null;
		this._rating = null;
		this._gamesCount = null;
		this._winsCount = null;
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
				this._gamesCount = data.countGames;
				this._winsCount = data.countWins;
				this._loggedIn = true;
			} else {
				this.reset();
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
			}
			return serverResponse;
		});
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

	/**
	 * Upload users avatar
	 * 
	 * @param {Object} data Avatar
	 * @returns {Promise} Server response.
	 */
	uploadAvatar(data) {
		const serverResponse = this._API.POST('user/update_avatar', data, false);
		return serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				return this.loadUser(); // replace this with: this.avatar = data.file;
			}
			return serverResponse;
		});
	}

	/**
	 * Edit users nickname
	 * 
	 * @param {Object} data Nickname
	 * @returns {Promise} Server response.
	 */
	editNickname(data) {
		const serverResponse = this._API.POST('user/update_nickname', data);
		return serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				this._nickname = data.nickname;
			}
			return serverResponse;
		});
	}

	/**
	 * Edit users email
	 * 
	 * @param {Object} data Email
	 * @returns {Promise} Server response.
	 */
	editEmail(data) {
		const serverResponse = this._API.POST('user/update_email', data);
		return serverResponse.then(response => {
			if(this._API.responseSuccess(response)) {
				this._email = data.email;
			}
			return serverResponse;
		});
	}

	/**
	 * Edit users password
	 * 
	 * @param {Object} data Password
	 * @returns {Promise} Server response.
	 */
	editPassword(data) {
		return this._API.POST('user/update_password', data);
	}

	/**
	 * Logout user.
	 * @returns {Promise} Server response.
	 */
	logout() {
		const serverResponse = this._API.POST('user/signout');
		return serverResponse.then(() => {
			this.reset();
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

	get games() {
		return this._gamesCount;
	}

	get wins() {
		return this._winsCount;
	}

}

export default User;
