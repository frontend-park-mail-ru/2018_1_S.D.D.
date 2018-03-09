'use strict';

import Controller from './Controller';
import ErrorModel from '../models/ErrorModel';
import ErrorView from '../views/ErrorView';

class ErrorController extends Controller {
	/**
	 * Creates instance of ErrorController
	 */
	constructor() {
		super();
		this._Error = new ErrorModel();
		this._View = new ErrorView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('404', this.action404);
		this.addAction('index', this.action404);
		this.addAction('503', this.action503);
	}

	/**
	 * Page not found.
	 */
	action404() {
		const data = {
			'Error': this._Error.get404Message()
		};
		this._View.constructPage(data);
		this._View.showPage();
	}

	/**
	 * Service unavailable.
	 */
	action503() {
		const data = {
			'Error': this._Error.get503Message()
		};
		this._View.constructPage(data);
		this._View.showPage();
	}
}

export default ErrorController;
