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
		this._Model = new ErrorModel();
		this._View = new ErrorView();
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
			'Error': this._Model.get403Message(),
			'Header': this._Model.getHeaderData()
		};
		this._View.construct403(data);
		this._View.showPage();
	}

	/**
	 * Page not found.
	 */
	action404() {
		const data = {
			'Error': this._Model.get404Message(),
			'Header': this._Model.getHeaderData()
		};
		this._View.constructPage(data);
		this._View.showPage();
	}

	/**
	 * Service unavailable.
	 */
	action503() {
		const data = {
			'Error': this._Model.get503Message(),
			'Header': this._Model.getHeaderData()
		};
		this._View.constructPage(data);
		this._View.showPage();
	}
}

export default ErrorController;
