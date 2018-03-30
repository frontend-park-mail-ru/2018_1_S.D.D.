'use strict';

import Model from './Model';

/**
 * Creates instance of UserModel
 * 
 * @class
 * @classdesc User model. Provide data for template rendering.
 */
class UserModel extends Model {
	/**
	 * Creates instance of UserModel
	 */
	constructor() {
		super();
	}

	/**
	 * Reset user in local storage.
	 */
	resetUser() {
		const UserStorage = this.ServiceManager.UserStorage;

		UserStorage.setData('loggedin', false);
		UserStorage.setData('avatar', '');
		UserStorage.setData('nickname', '');
		UserStorage.setData('email', '');
		UserStorage.setData('rating', '');
		UserStorage.setData('countGames', '');
		UserStorage.setData('countWins', '');
	}

	/**
	 * Fill local storage with user data.
	 * 
	 * @param {Object} response Server response.
	 */
	fillUser(response) {
		const UserStorage = this.ServiceManager.UserStorage;
		const user = response.data.current_user;

		UserStorage.setData('avatar', user.avatar);
		UserStorage.setData('nickname', user.nickname);
		UserStorage.setData('email', user.email);
		UserStorage.setData('rating', user.rating);
		UserStorage.setData('countGames', user.countGames);
		UserStorage.setData('countWins', user.countWins);
		UserStorage.setData('loggedin', true);
	}

	/**
	 * Sign up user. If success - login user.
	 * 
	 * @param {Object} formData Sign up data.
	 * @param {Function} onSuccessCallback What we do after login.
	 * @param {Function} onErrorCallback What we do if request returned error.
	 */
	signup(formData, onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;

		API.POST('user/signup', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					const loginData = {
						nickname: formData.nickname,
						password: formData.password
					};
					this.login(loginData, onSuccessCallback, onErrorCallback);
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

	/**
	 * Login user.
	 * 
	 * @param {Object} formData Login and password.
	 */
	login(formData) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;

		API.POST('user/signin', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					this.loadUser(false);
				} else {
					EventBus.emit('loginerror', response.errors);
				}
			})
			.catch(error => {
				EventBus.emit('loginerror', {'general': error});
			});
	}

	/**
	 * Get user info from server if user logged in.
	 * 
	 * @param {boolean} useStorageFirst Use local storage or connect to server.
	 */
	loadUser(useStorageFirst = true) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;
		const loggedin = UserStorage.getBooleanData('loggedin');

		if (loggedin === null || !useStorageFirst) {
			API.GET('user/info')
				.then(response => {
					if (API.responseSuccess(response)) {
						this.fillUser(response);
						EventBus.emit('login');
					} else {
						this.resetUser();
						EventBus.emit('logout');
					}
				})
				.catch(() => {
					EventBus.emit('error:noresponse');
				});
		} else {
			if (loggedin) {
				EventBus.emit('login');
			} else {
				EventBus.emit('logout');
			}
		}
	}

	/**
	 * Upload users avatar to server.
	 * 
	 * @param {Object} formData Avatar
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	uploadAvatar(formData, onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;
		const UserStorage = this.ServiceManager.UserStorage;

		API.POST('user/update_avatar', formData, false)
			.then(response => {
				if (API.responseSuccess(response)) {
					UserStorage.avatar = response.data.avatar;
					onSuccessCallback();
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

	/**
	 * Edit nickname with incoming data.
	 * 
	 * @param {Object} formData Serialized form values
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	editNickname(formData, onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;
		const UserStorage = this.ServiceManager.UserStorage;

		API.POST('user/update_nickname', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					UserStorage.nickname = formData.nickname;
					onSuccessCallback();
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

	/**
	 * Edit email with incoming data.
	 * 
	 * @param {Object} formData Serialized form values
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	editEmail(formData, onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;
		const UserStorage = this.ServiceManager.UserStorage;
		
		API.POST('user/update_email', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					UserStorage.email = formData.email;
					onSuccessCallback();
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

	/**
	 * Edit password with incoming data.
	 * 
	 * @param {Object} formData Serialized form values
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	editPassword(formData, onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;

		API.POST('user/update_password', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					onSuccessCallback();
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

	/**
	 * Logout user.
	 */
	logout() {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;

		if (UserStorage.getData('loggedin')) {
			API.POST('user/signout')
				.then(() => {
					this.resetUser();
					EventBus.emit('logout');
				})
				.catch(() => {
					EventBus.emit('error:noresponse');
				});
		} else {
			EventBus.emit('logout');
		}
	}

}

export default UserModel;
