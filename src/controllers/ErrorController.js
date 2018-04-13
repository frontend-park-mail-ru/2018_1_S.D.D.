'use strict';

import Controller from './Controller';
import ErrorView from '../views/ErrorView';

class ErrorController extends Controller {
	/**
	 * Creates instance of ErrorController
	 */
	constructor() {
		super();
		this.ErrorView = new ErrorView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('403', this.action403);
		this.addAction('404', this.action404);
		this.addAction('index', this.action404);
		this.addAction('503', this.action503);
	}

	/**
	 * Login required.
	 */
	action403() {
		const data = {
			'Error': this.get403Message(),
			'Header': this.getHeaderData()
		};
		this.ErrorView.constructPage(data);
	}

	/**
	 * Page not found.
	 */
	action404() {
		const data = {
			'Error': this.get404Message(),
			'Header': this.getHeaderData()
		};
		this.ErrorView.constructPage(data);
	}

	/**
	 * Service unavailable.
	 */
	action503() {
		const data = {
			'Error': this.get503Message(),
			'Header': this.getHeaderData()
		};
		this.ErrorView.constructPage(data);
	}

	/**
	 * Get 403 error message.
	 * 
	 * @returns {Object} 403 error message.
	 */
	get403Message() {
		const url = this.ServiceManager.Router.getNewUrlPath();
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
		const url = this.ServiceManager.Router.getNewUrlPath();
		return {
			Code: '404',
			Header: 'We can\'t find what are you looked for...',
			Message: 'Are you sure that "' + url + '" is correct address?'
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
			Header: 'Application is not responding. We are sorry about that!',
			Message: 'You still can (probably) play offline if you want...'
		};
	}
}

export default ErrorController;
