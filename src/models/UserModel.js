'use strict';

import Model from './Model';
import validation from '../modules/validations';

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

	getProfileData(backUrl = '/') {
		const User = this._ServiceManager.User;
		return {
			url: backUrl,
			nickname: User.nickname,
			gamesCount: User.games,
			winsCount: User.wins,
			rating: User.rating,
		};
	}

	getEditNickname(onSubmitCallback) {
		const User = this._ServiceManager.User;
		return this.defaultLoginForm = {
			back: true,
			header: false,
			social: false,
			formAction: '/user/edit/nickname',
			onSubmit: () => onSubmitCallback(),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: User.nickname
				}
			],
			button: 'CHANGE NICKNAME!'
		};
	}

	getEditEmail(onSubmitCallback) {
		const User = this._ServiceManager.User;
		return this.defaultLoginForm = {
			header: false,
			social: false,
			formAction: '/user/edit/email',
			onSubmit: () => onSubmitCallback(),
			formInputs: [
				{
					type: 'text',
					name: 'email',
					placeholder: User.email
				}
			],
			button: 'CHANGE EMAIL!'
		};
	}

	getEditPassword(onSubmitCallback) {
		return this.defaultLoginForm = {
			header: false,
			social: false,
			formAction: '/user/edit/password',
			onSubmit: () => onSubmitCallback(),
			formInputs: [
				{
					type: 'password',
					name: 'oldPassword',
					placeholder: 'Old password'
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'New password'
				},
				{
					type: 'password',
					name: 'passwordCheck',
					placeholder: 'Confirm password'
				}
			],
			button: 'CHANGE PASSWORD!'
		};
	}

	/**
	 * Validate nickname form.
	 * 
	 * @param {Object} formData Serealized form values.
	 * @returns {Object} Error messages.
	 */
	validateNickname(formData) {
		return {
			nickname: validation.login(formData.nickname)
		};
	}

	/**
	 * Validate email form.
	 * 
	 * @param {Object} formData Serealized form values.
	 * @returns {Object} Error messages.
	 */
	validateEmail(formData) {
		return {
			email: validation.email(formData.email)
		};
	}

	/**
	 * Validate password form.
	 * 
	 * @param {Object} formData Serealized form values.
	 * @returns {Object} Error messages.
	 */
	validatePassword(formData) {
		return {
			oldPassword: validation.password(formData.oldPassword),
			password: validation.password(formData.password, formData.passwordCheck),
			passwordCheck: validation.password(formData.passwordCheck, formData.password)
		};
	}

	/**
	 * Edit nickname with incoming data.
	 * 
	 * @param {Object} formData Serialized form values
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	editNickname(formData, onSuccessCallback, onErrorCallback) {
		const API = this._ServiceManager.ApiService;
		const User = this._ServiceManager.User;

		User.editNickname(formData)
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
	 * Edit email with incoming data.
	 * 
	 * @param {Object} formData Serialized form values
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	editEmail(formData, onSuccessCallback, onErrorCallback) {
		const API = this._ServiceManager.ApiService;
		const User = this._ServiceManager.User;
		
		User.editEmail(formData)
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
	 * Edit password with incoming data.
	 * 
	 * @param {Object} formData Serialized form values
	 * @param {Function} onSuccessCallback What we do after editing
	 * @param {Function} onErrorCallback What we do if request returned error
	 */
	editPassword(formData, onSuccessCallback, onErrorCallback) {
		const API = this._ServiceManager.ApiService;
		const User = this._ServiceManager.User;

		User.editPassword(formData)
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
		const User = this._ServiceManager.User;
		if(User.isLogged()) {
			User.logout()
				.then(() => {
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
