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
}

export default ErrorModel;
