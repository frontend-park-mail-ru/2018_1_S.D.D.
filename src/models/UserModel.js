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
				if(API.responseSuccess(response)) {
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
	 * @param {Function} onSuccessCallback What we do after login.
	 * @param {Function} onErrorCallback What we do if request returned error.
	 */
	login(formData, onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;

		API.POST('user/signin', formData)
			.then(response => {
				if(API.responseSuccess(response)) {
					this.loadUser(onSuccessCallback, onErrorCallback, onErrorCallback);
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

	/**
	 * Get user info from server if user logged in.
	 * 
	 * @param {Function} onLoginCallback What we do if user filled.
	 * @param {Function} onGuestCalback What we do if user is not logged in.
	 * @param {Function} onErrorCallback What we do if request returned error.
	 */
	loadUser(onLoginCallback = () => {}, onGuestCalback = () => {}, onErrorCallback = () => {}) {
		const API = this.ServiceManager.ApiService;
		const UserStorage = this.ServiceManager.UserStorage;

		API.GET('user/info')
			.then(response => {
				if(API.responseSuccess(response)) {
					UserStorage.fill(response.data.current_user);
					onLoginCallback();
				} else {
					UserStorage.reset();
					onGuestCalback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
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
				if(API.responseSuccess(response)) {
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
				if(API.responseSuccess(response)) {
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
				if(API.responseSuccess(response)) {
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
				if(API.responseSuccess(response)) {
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
	 * 
	 * @param {Function} onSuccessCallback What to do when user is logged out.
	 * @param {Function} onErrorCallback What to do if we got error.
	 */
	logout(onSuccessCallback, onErrorCallback) {
		const API = this.ServiceManager.ApiService;
		const UserStorage = this.ServiceManager.UserStorage;

		if(UserStorage.isLogged()) {
			API.POST('user/signout')
				.then(() => {
					UserStorage.reset();
					onSuccessCallback();
				})
				.catch(() => {
					onErrorCallback();
				});
		} else {
			onSuccessCallback();
		}
	}

}

export default UserModel;
