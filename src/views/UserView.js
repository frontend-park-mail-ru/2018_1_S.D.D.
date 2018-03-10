'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';

/**
 * Creates instance of SignupView
 * 
 * @class
 * @classdesc Signup view. Render, shows, hide page.
 */
class SignupView extends View {
	/**
	 * Creates instance of SignupView
	 */
	constructor() {
		super();
	}
	
	/**
	 * Load all required templates.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructPage(data = {}) {
		this._data = data;
	}

	/**
	 * Reload and delete all required templates after logout.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	reconstructPage(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true, reload: true });
	}

	/**
	 * Display reuired templates.
	 */
	showPage() {
	}
}

export default SignupView;
