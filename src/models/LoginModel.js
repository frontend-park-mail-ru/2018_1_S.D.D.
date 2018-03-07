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
		this.defaultLoginForm = {
			header: 'Login',
			social: true,
			formAction: '/login/submit',
			onSubmit: function() {
				this._ServiceManager.Router.go('/login/submit', false);
			}.bind(this),
			formInputs: [
				{
					type: 'text',
					name: 'login',
					placeholder: 'Login'
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'Password'
				}
			],
			button: 'Login'
		};
	}
	
	/**
	 * Get login form data.
	 * 
	 * @returns {Object} Inputs and header.
	 */
	getLoginForm() {
		return this.defaultLoginForm;
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
			return 'Login should be at least 6 characters in length!';
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
			login: this.validateLogin(formData.login),
			password: this.validatePassword(formData.password)
		};
	}
}

export default LoginModel;
