'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import ProfileTemplate from '../ui/templates/profile/';

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
	 * Load all required templates for profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructProfile(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });
		this.load('Profile', ProfileTemplate, { block: 'left', reload: true });
	}

	/**
	 * Reload and delete all required templates after logout.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructLogout(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true, reload: true });
	}

	/**
	 * Display reuired templates for profile page.
	 */
	showProfile() {
		this.show('Header');
		this.show('Profile');
	}
}

export default SignupView;
