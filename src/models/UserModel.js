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
	 */
	signup(formData) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;

		API.POST('user/signup', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					const loginData = {
						nickname: formData.nickname,
						password: formData.password
					};
					this.login(loginData, true);
				} else {
					EventBus.emit('signupError', response.errors);
				}
			})
			.catch(error => {
				EventBus.emit('signupError', {'general': error});
			});
	}

	/**
	 * Login user.
	 * 
	 * @param {Object} formData Login and password.
	 * @param {boolean} signup Flag if current action is signup.
	 */
	login(formData, signup = false) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;

		const errorHandler = (error) => {
			if (signup) {
				EventBus.emit('signupError', error);
			} else {
				EventBus.emit('loginError', error);
			}
		};

		API.POST('user/signin', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					this.loadUser();
				} else {
					errorHandler(response.errors);
				}
			})
			.catch(error => {
				errorHandler({'general': error});
			});
	}

	/**
	 * Get user info from server if user logged in.
	 */
	loadUser() {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;

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
	}

	/**
	 * Upload users avatar to server.
	 * 
	 * @param {Object} formData Avatar
	 */
	uploadAvatar(formData) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;

		API.POST('user/update_avatar', formData, false)
			.then(response => {
				if (API.responseSuccess(response)) {
					UserStorage.setData('avatar', response.data.avatar);
					EventBus.emit('avatarChanged');
				} else {
					EventBus.emit('avatarUploadingError', response.errors);
				}
			})
			.catch(error => {
				EventBus.emit('avatarUploadingError', {'general': error});
			});
	}

	/**
	 * Edit nickname with incoming data.
	 */
	editNickname(formData) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;

		API.POST('user/update_nickname', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					UserStorage.setData('nickname', formData.nickname);
					EventBus.emit('nicknameChanged');
				} else {
					EventBus.emit('editnicknameError', response.errors);
				}
			})
			.catch(error => {
				EventBus.emit('editnicknameError', {'general': error});
			});
	}

	/**
	 * Edit email with incoming data.
	 */
	editEmail(formData) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;
		
		API.POST('user/update_email', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					UserStorage.setData('email', formData.email);
					EventBus.emit('emailChanged');
				} else {
					EventBus.emit('editemailError', response.errors);
				}
			})
			.catch(error => {
				EventBus.emit('editemailError', {'general': error});
			});
	}

	/**
	 * Edit password with incoming data.
	 */
	editPassword(formData) {
		const API = this.ServiceManager.ApiService;
		const EventBus = this.ServiceManager.EventBus;

		API.POST('user/update_password', formData)
			.then(response => {
				if (API.responseSuccess(response)) {
					EventBus.emit('passwordChanged');
				} else {
					EventBus.emit('editpasswordError', response.errors);
				}
			})
			.catch(error => {
				EventBus.emit('editpasswordError', {'general': error});
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
