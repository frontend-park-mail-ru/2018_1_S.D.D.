'use strict';

import Controller from './Controller';
import AboutView from '../views/AboutView';

class AboutController extends Controller {
	/**
	 * Creates instance of AboutController
	 */
	constructor() {
		super();
		this.AboutView = new AboutView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
	}

	/**
	 * Default action. Renders menu.
	 */
	actionIndex() {
		const data = {
			'Header': this.getHeaderData()
		};
		this.AboutView.constructPage(data);
		this.AboutView.showPage();
	}
}

export default AboutController;
