'use strict';

import Model from './Model';
import validation from '../modules/validations';

/**
 * Creates instance of LoginModel
 * 
 * @class
 * @classdesc Login model. Provide data for template rendering.
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
	 * Validate form.
	 * 
	 * @param {Object} formData Serealized form values.
	 * @returns {Object} Error messages.
	 */
	validate(formData) {
		return {
			nickname: validation.login(formData.nickname),
			password: validation.password(formData.password)
		};
	}

	authenticate(formData, onSuccessCallback, onErrorCallback) {
		const API = this._ServiceManager.ApiService;
		const User = this._ServiceManager.User;

		const resp = User.login(formData);
		resp
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


}

export default LoginModel;
