'use strict';

import Controller from './Controller';

class ScoresController extends Controller {
	/**
	 * Creates instance of ScoresController
	 */
	constructor() {
		super();

		this.addActions();
		this.data = {

		};
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
	}

	/**
	 * Common action. Show scores table
	 */
	actionIndex() {
		this._View.constructPage(this.data);
		this._View.showPage();
	}

	
}

export default ScoresController;