'use strict';

import Model from './Model';

/**
 * Creates instance of ErrorModel
 * 
 * @class
 * @classdesc Error model. Provide data for template rendering.
 */
class ErrorModel extends Model {
	/**
	 * Creates instance of ErrorModel
	 */
	constructor() {
		super();
	}

	/**
	 * Get 403 error message.
	 * 
	 * @returns {Object} 403 error message.
	 */
	get403Message() {
		const url = this._ServiceManager.Router.getNewUrlPath();
		return {
			Code: '403',
			Header: 'This place is strictly forbidden for guys like you!',
			Message: 'You should sign in first to look on ' + url
		};
	}
	
	/**
	 * Get 404 error message.
	 * 
	 * @returns {Object} 404 error message.
	 */
	get404Message() {
		const url = this._ServiceManager.Router.getNewUrlPath();
		return {
			Code: '404',
			Header: 'We can\'t find what are you looked for...',
			Message: 'Are you sure that "' + url + '" is correct addres?'
		};
	}

	/**
	 * Get 503 error message.
	 * 
	 * @returns {Object} 503 error message.
	 */
	get503Message() {
		return {
			Code: '503',
			Header: 'Backend server not responding. We are sorry about that!',
			Message: 'You still can play offline if you want...'
		};
	}
}

export default ErrorModel;
