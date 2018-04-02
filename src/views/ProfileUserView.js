'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import ProfileTemplate from '../ui/templates/profile/';
import AvatarTemplate from '../ui/templates/avatar/';

/**
 * Creates instance of UserView
 * 
 * @class
 * @classdesc User view. Render, shows, hide page.
 */
class ProfileUserView extends View {
	/**
	 * Creates instance of UserView
	 */
	constructor() {
		super();
	}

	/**
	 * Reloading avatars after loading new profile picture.
	 * 
	 * @param {Object} data Data for template rendering
	 */
	reloadAvatar(data = {}) {
		this._data = data;
		const visible = this.isVisible('ProfileAvatar');
		if (this.load('ProfileAvatar', AvatarTemplate, { reload: true }) && visible) {
			this.show('ProfileAvatar');
		}
	}

	/**
	 * Reloading profile data after user data changed.
	 * 
	 * @param {Object} data Data for template rendering
	 */
	reloadProfile(data = {}) {
		this._data = data;
		const visible = this.isVisible('Profile');
		if (this.load('Profile', ProfileTemplate, { reload: true }) && visible) {
			this.show('Profile');
			
		}
	}
	
	/**
	 * Load all required templates for profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructProfile(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });

		const connected = ['ProfileAvatar', 'Profile'];
		this.load('ProfileAvatar', AvatarTemplate, { block: 'main', connected: connected });
		this.load('Profile', ProfileTemplate, { block: 'main', connected: connected });
	}

	/**
	 * Destroy profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	destroyProfile() {
		this.remove('Profile');
		this.remove('ProfileAvatar');
	}

	/**
	 * Display required templates for profile page.
	 */
	showProfile() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Profile');
		this.show('ProfileAvatar');
	}
}

export default ProfileUserView;
