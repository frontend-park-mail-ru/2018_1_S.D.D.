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
		this.data = {
			'Header': this._Model.getHeaderData()
		};
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('logout', this.actionLogout);
	}

	/**
	 * Common action doesn't exists. Show 404.
	 */
	actionIndex() {
		this.go('/404', false);
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
				this._View.reconstructPage(reconstructData);
				this.go('/');
			},
			() => {
				this.go('/error/503', false);
			}
		);
	}
}

export default UserController;
