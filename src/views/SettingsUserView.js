'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import AvatarTemplate from '../ui/templates/avatar/';
import FormTemplate from '../ui/templates/form/';

/**
 * Creates instance of UserView
 * 
 * @class
 * @classdesc User view. Render, shows, hide page.
 */
class SettingsUserView extends View {
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
		if (!form) {
			return false;
		}
		return FormTemplate.serialize(form);
	}

	/**
	 * Serealize avatar form.
	 * 
	 * @returns {Object|boolean} Get form data {name: value} or false if form not found.
	 */
	serializeAvatar() {
		const form = this.load('UploadAvatar');
		if (!form) {
			return false;
		}
		return FormTemplate.serializeMultipart(form);
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
		if (!form) {
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
		
		if (this.isVisible(formTemplateName)) {
			this.onLoad([
				[formTemplateName, FormTemplate, { reload: true }]
			])
				.then(() => {
					this.show(formTemplateName);
				});
		}
	}

	/**
	 * Reloading avatars after loading new profile picture.
	 * 
	 * @param {Object} data Data for template rendering
	 */
	reloadAvatar(data = {}) {
		this._data = data;
		this.reloadForm('UploadAvatar', data);

		if (this.isVisible('Avatar')) {
			this.onLoad([
				['Avatar', AvatarTemplate, { reload: true }]
			])
				.then(() => {
					this.show('Avatar');
				});
		}
	}

	/**
	 * Load all required templates for profile page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructSettings(data = {}) {
		this._data = data;
		const connectedLeft = ['Avatar', 'UploadAvatar'];
		const connectedRight = ['EditNickname', 'EditEmail', 'EditPassword'];

		return this.onLoad([
			['Header', HeaderTemplate, { appendFirst: true }],
			['Avatar', AvatarTemplate, { block: 'left', connected: connectedLeft }],
			['UploadAvatar', FormTemplate, { block: 'left', connected: connectedLeft }],
			['EditNickname', FormTemplate, { block: 'right', connected: connectedRight }],
			['EditEmail', FormTemplate, { block: 'right', connected: connectedRight }],
			['EditPassword', FormTemplate, { block: 'right', connected: connectedRight }]
		])
			.then(() => {
				this.showSettings();
			});
	}

	/**
	 * Destroy setings page.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	destroySettings() {
		this.remove('EditNickname');
		this.remove('EditEmail');
		this.remove('EditPassword');
		this.remove('Avatar');
		this.remove('UploadAvatar');
	}

	/**
	 * Display required templates for settings page.
	 */
	showSettings() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Avatar');
		this.show('UploadAvatar');
		this.show('EditNickname');
		this.show('EditEmail');
		this.show('EditPassword');
	}
}

export default SettingsUserView;
