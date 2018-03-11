'use strict';

import Controller from './Controller';
import UserModel from '../models/UserModel';
import UserView from '../views/UserView';

class UserController extends Controller {
	/**
	 * Creates instance of UserController
	 */
	constructor() {
		super();
		this._Model = new UserModel();
		this._View = new UserView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('profile', this.actionProfile);
		this.addAction('settings', this.actionSettings);
		this.addAction('edit', this.actionEdit);
		this.addAction('logout', this.actionLogout);
	}

	/**
	 * Common action doesn't exists. Show 404.
	 */
	actionIndex() {
		this.go('/error/404', false);
	}

	/**
	 * Show user profile.
	 */
	actionProfile() {
		this._Model.onAuth(
			() => {
				const data = {
					'Header': this._Model.getHeaderData(),
					'Profile': this._Model.getProfileData('/')
				};
				this._View.constructProfile(data);
				this._View.showProfile();
			},
			() => {
				this.go('/error/403', false);
			}
		);
	}

	/**
	 * Show form with user`s settings
	 */
	actionSettings() {
		this._Model.onAuth(
			() => {
				const data = {
					'Header': this._Model.getHeaderData(),
					'EditNickname': this._Model.getEditNickname(() => this._ServiceManager.Router.go('/user/edit/nickname', false)),
					'EditEmail': this._Model.getEditEmail(() => this._ServiceManager.Router.go('/user/edit/email', false)),
					'EditPassword': this._Model.getEditPassword(() => this._ServiceManager.Router.go('/user/edit/password', false))
				};
				this._View.constructSettings(data);
				this._View.showSettings();
			},
			() => {
				this.go('/error/403', false);
			}
		);
	}

	/**
	 * Submit action. Edit user settings. Validate form and submit data to server if ok.
	 * 
	 * @param {string[]} parameters Contains what to edit
	 */
	actionEdit(parameters = []) {
		this._Model.onAuth(
			() => {
				const editParam = parameters[0];
				if(!editParam) {
					this.go('/error/404', false);
				}

				const formTemplate = this._getTemplate(editParam);

				let submitData = this._View.serializeForm(formTemplate);
				if(!submitData) {
					const data = {
						'Header': this._Model.getHeaderData(),
						'EditNickname': this._Model.getEditNickname(() => this._ServiceManager.Router.go('/user/edit/nickname', false)),
						'EditEmail': this._Model.getEditEmail(() => this._ServiceManager.Router.go('/user/edit/email', false)),
						'EditPassword': this._Model.getEditPassword(() => this._ServiceManager.Router.go('/user/edit/password', false))
					};
					this._View.constructPage(data);
					submitData = this._View.serializeForm(formTemplate);
				}

				const validation = this._validateData(editParam, submitData);

				let noValidationError = true;
				for(let input in validation) {
					if(validation[input]) {
						this._View.addFormError(formTemplate, input, validation[input]);
						noValidationError = false;
					}
				}

				const errorCallback = errors => {
					for(let e in errors) {
						this._View.addFormError(formTemplate, e, errors[e]);
					}
					this.go('/user/settings');
				};
				
				if(noValidationError) {
					switch(editParam) {
					case 'nickname':
						this._Model.editNickname(
							submitData,
							() => {
								const data = {
									'Header': this._Model.getHeaderData(),
									'EditNickname': this._Model.getEditNickname(
										() => this._ServiceManager.Router.go('/user/edit/nickname', false)
									)
								};
								this._View.reloadForm('EditNickname', data);
								this._View.reloadHeader(data);
							},
							errorCallback
						);
						break;
					case 'email':
						this._Model.editEmail(
							submitData,
							() => {
								const data = {
									'EditEmail': this._Model.getEditEmail(
										() => this._ServiceManager.Router.go('/user/edit/email', false)
									)
								};
								this._View.reloadForm('EditEmail', data);
							},
							errorCallback
						);
						break;
					case 'password':
						this._Model.editPassword(
							submitData,
							() => {
								const data = {
									'EditPassword': this._Model.getEditPassword(
										() => this._ServiceManager.Router.go('/user/edit/password', false)
									)
								};
								this._View.reloadForm('EditPassword', data);
							},
							errorCallback
						);
						break;
					}
				} else {
					this.go('/user/settings');
				}
			},
			() => {
				this.go('/error/403', false);
			}
		);
	}

	/**
	 * Logout action. Delete user from current session. Delete user templates.
	 * 
	 * @param parameters Contains flag if we need go to menu page.
	 */
	actionLogout(parameters = []) {
		const goToMenu = parameters[0] !== 'quietly';
		this._Model.logout(
			() => {
				const reconstructData = {
					'Header': this._Model.getHeaderData()
				};
				this._View.constructLogout(reconstructData);
				if(goToMenu) {
					this.go('/');
				}
			},
			() => {
				this.go('/error/503', false);
			}
		);
	}

	/**
	 * Get form template name depends on url parameter.
	 * 
	 * @param {string} param Url parameter.
	 * @returns {string} Form template name.
	 */
	_getTemplate(param) {
		switch(param) {
		case 'nickname':
			return 'EditNickname';
		case 'email':
			return 'EditEmail';
		case 'password':
			return 'EditPassword';
		default:
			this.go('/error/404', false);
		}
	}

	/**
	 * Validate form data depends on url parameter.
	 * 
	 * @param {string} param Url parameter.
	 * @returns {Object} Validated data.
	 */
	_validateData(param, submitData) {
		switch(param) {
		case 'nickname':
			return this._Model.validateNickname(submitData);
		case 'email':
			return this._Model.validateEmail(submitData);
		case 'password':
			return this._Model.validatePassword(submitData);
		default:
			this.go('/error/404', false);
		}
	}
}

export default UserController;
