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
	 * Serealize nickname form.
	 * 
	 * @param {string} formTemplate Form to serialize.
	 * @returns {Object|boolean} Get form data {name: value} or false if form not found.
	 */
	serializeForm(formTemplate) {
		const form = this.load(formTemplate);
		if(!form) {
			return false;
		}
		return FormTemplate.serialize(form);
	}

	/**
	 * Add error message to input in nickname form.
	 * 
	 * @param {string} formTemplate Form to serialize.
	 * @param {string} input Input name.
	 * @param {string} message Error message.
	 * @returns {boolean} True if ok, false if form or input not found.
	 */
	addFormError(formTemplate, input, message) {
		const form = this.load(formTemplate);
		if(!form) {
			return false;
		}
		return FormTemplate.addError(input, message, form);
	}

	/**
	 * Reloading form in DOM.
	 * 
	 * @param {strng} formTemplateName Name of form template to reload
	 * @param {Object} data Data for template rendering
	 */
	reloadForm(formTemplateName, data = {}) {
		this._data = data;
		this.load(formTemplateName, FormTemplate, { reload: true });
		this.show(formTemplateName);
	}

	/**
	 * Reloading header in DOM.
	 * 
	 * @param {Object} data Data for template rendering
	 */
	reloadHeader(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { reload: true });
		this.show('Header');
	}
	
	
	/**
	 * Load all required templates for profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructProfile(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });
		this.load('Profile', ProfileTemplate, { block: 'main', reload: true });
	}

	/**
	 * Load all required templates for profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructSettings(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });
		this.load('ChangeAvatar', AvatarTemplate, { block: 'left' });

		const connected = ['EditNickname', 'EditEmail', 'EditPassword'];
		this.load('EditNickname', FormTemplate, { block: 'right', connected: connected });
		this.load('EditEmail', FormTemplate, { block: 'right', connected: connected });
		this.load('EditPassword', FormTemplate, { block: 'right', connected: connected });
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
		this.remove('EditNickname');
		this.remove('EditEmail');
		this.remove('EditPassword');
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
		this.show('EditNickname');
		this.show('EditEmail');
		this.show('EditPassword');
	}
}

export default UserView;
