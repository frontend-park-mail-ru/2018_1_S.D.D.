'use strict';

export default {
	/**
	 * Validate password.
	 * 
	 * @param {string} password First password value.
	 * @param {string} passwordCheck Second password value.
	 * @returns {string|boolean} Error message or false if no validation error.
	 */
	password: (password, passwordCheck = null) => {
		if(password === '') {
			return 'You should fill password field!';
		}
		if(password.length < 6) {
			return 'Password should be at least 6 characters in length!';
		}
		if(passwordCheck !== null && password !== passwordCheck) {
			return 'Different passwords were entered!';
		}
		return false;
	},
	
	/**
	 * Validate email.
	 * 
	 * @param {string} email Email value.
	 * @returns {string|boolean} Error message or false if no validation error.
	 */
	email: email => {
		if(email === '') {
			return 'You should fill email field!';
		}
		const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i;
		if(!emailPattern.test(email)) {
			return 'That\'s not valid email!';
		}
		
		return false;
	},

	/**
	 * Validate login.
	 * 
	 * @param {string} login Login value.
	 * @returns {string|boolean} Error message or false if no validation error.
	 */
	login: login => {
		if(login === '') {
			return 'You should fill login field!';
		}
		if(login.length < 4) {
			return 'Login should be at least 4 characters in length!';
		}
		return false;
	}
};