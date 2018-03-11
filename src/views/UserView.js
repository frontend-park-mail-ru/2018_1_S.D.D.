'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import ProfileTemplate from '../ui/templates/profile/';
import AvatarTemplate from '../ui/templates/logo/';
import FormTemplate from '../ui/templates/form/';

/**
 * Creates instance of UserView
 * 
 * @class
 * @classdesc User view. Render, shows, hide page.
 */
class UserView extends View {
	/**
	 * Creates instance of UserView
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
	 * Load all required templates for profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructSettings(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });
		this.load('ChangeAvatar', AvatarTemplate, { block: 'left', reload: true });
		this.load('Settings1', FormTemplate, { block: 'right', reload: true, connected: ['Settings2'] });
		this.load('Settings2', FormTemplate, { block: 'right', reload: true, connected: ['Settings1'] });
	}

	/**
	 * Reload and delete all required templates after logout.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructLogout(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true, reload: true });
		this.remove('Profile');
		this.remove('Settings');
	}

	/**
	 * Display required templates for profile page.
	 */
	showProfile() {
		this.show('Header');
		this.show('Profile');
	}

	/**
	 * Display required templates for settings page.
	 */
	showSettings() {
		this.show('Header');
		this.show('ChangeAvatar');
		this.show('Settings1');
		this.show('Settings2');
	}
}

export default UserView;
