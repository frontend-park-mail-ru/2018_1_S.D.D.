'use strict';

import Controller from './Controller';
import ScoresModel from '../models/ScoresModel';
import ScoresView from '../views/ScoresView';

class ScoresController extends Controller {
	/**
	 * Creates instance of ScoresController
	 */
	constructor() {
		super();
		this._Model = new ScoresModel();
		this._View = new ScoresView();

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