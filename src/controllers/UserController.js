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
					'Settings': this._Model.getSettingsData('/')
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
	 * Logout action. Delete user from current session. Delete user templates.
	 */
	actionLogout() {
		this._Model.logout(
			() => {
				const reconstructData = {
					'Header': this._Model.getHeaderData()
				};
				this._View.constructLogout(reconstructData);
				this.go('/');
			},
			() => {
				this.go('/error/503', false);
			}
		);
	}
}

export default UserController;
