'use strict';

import Model from './Model';
import validation from '../modules/validations';

/**
 * Creates instance of SignupModel
 * 
 * @class
 * @classdesc Signup model. Provide data for template rendering.
 */
class SignupModel extends Model {
	/**
	 * Creates instance of SignupModel
	 */
	constructor() {
		super();
	}
	
	/**
	 * Get Signup form data.
	 * 
	 * @param {Function} onSubmitCallback Form behaviour on submit event.
	 * @returns {Object} Inputs and header.
	 */
	getSignupForm(onSubmitCallback) {
		return {
			header: 'HI STRANGER!',
			social: false,
			formAction: '/signup/submit',
			onSubmit: () => onSubmitCallback(),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: 'Login'
				},
				{
					type: 'text',
					name: 'email',
					placeholder: 'Email'
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'Password'
				},
				{
					type: 'password',
					name: 'passwordCheck',
					placeholder: 'Repeat password'
				}
			],
			button: 'SIGN UP'
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
			password: validation.password(formData.password, formData.passwordCheck),
			passwordCheck: validation.password(formData.passwordCheck, formData.password),
			email: validation.email(formData.email)
		};
	}

	signup(formData, onSuccessCallback, onErrorCallback) {
		const API = this._ServiceManager.ApiService;
		const User = this._ServiceManager.User;

		User.signup(formData)
			.then(response => {
				if(API.responseSuccess(response)) {
					const loginData = {
						nickname: formData.nickname,
						password: formData.password
					};
					User.login(loginData)
						.then(() => {
							onSuccessCallback();
						})
						.catch(error => {
							onErrorCallback({'general': error});
						});
				} else {
					onErrorCallback(response.errors);
				}
			})
			.catch(error => {
				onErrorCallback({'general': error});
			});
	}

}

export default SignupModel;
