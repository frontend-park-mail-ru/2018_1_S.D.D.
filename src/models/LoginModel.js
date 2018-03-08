'use strict';

import Model from './Model';

/**
 * Creates instance of LoginModel
 * 
 * @class
 * @classdesc Error model. Provide data for template rendering.
 */
class LoginModel extends Model {
	/**
	 * Creates instance of LoginModel
	 */
	constructor() {
		super();
	}
	
	/**
	 * Get login form data.
	 * 
	 * @param {Function} onSubmitCallback Form behaviour on submit event.
	 * @returns {Object} Inputs and header.
	 */
	getLoginForm(onSubmitCallback) {
		return this.defaultLoginForm = {
			header: 'COME IN!',
			social: true,
			formAction: '/login/submit',
			onSubmit: () => onSubmitCallback(),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: 'Login'
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'Password'
				}
			],
			button: 'LOG IN'
		};
	}

	/**
	 * Validate login.
	 * 
	 * @param {string} value Login value.
	 * @returns {string|boolean} Error message or false if no validation error.
	 */
	validateLogin(value) {
		if(value === '') {
			return 'You should fill login field!';
		}
		if(value.length < 4) {
			return 'Login should be at least 4 characters in length!';
		}
		return false;
	}

	/**
	 * Validate password.
	 * 
	 * @param {string} value Password value.
	 * @returns {string|boolean} Error message or false if no validation error.
	 */
	validatePassword(value) {
		if(value === '') {
			return 'You should fill password field!';
		}
		if(value.length < 6) {
			return 'Password should be at least 6 characters in length!';
		}
		return false;
	}

	/**
	 * Validate form.
	 * 
	 * @param {Object} formData Serealized form values.
	 * @returns {Object} Error messages.
	 */
	validate(formData) {
		return {
			nickname: this.validateLogin(formData.nickname),
			password: this.validatePassword(formData.password)
		};
	}

	authenticate(formData, onSuccessCallback, onErrorCallback) {
		this._ServiceManager.ApiService.POST('user/signin', formData)
			.then(response => {
				if(this.responseSuccess(response)) {
					onSuccessCallback();
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}


}

export default LoginModel;
