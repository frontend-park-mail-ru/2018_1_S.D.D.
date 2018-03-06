'use strict';

import Controller from './Controller';
//import ErrorModel from '../models/LoginModel';
import LoginView from '../views/LoginView';

class LoginController extends Controller {
	/**
	 * Creates instance of LoginController
	 */
	constructor() {
		super();
		//this._Login = new LoginModel();
		this._View = new LoginView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
	}

	/**
	 * Common action. Show login form.
	 */
	actionIndex() {
		const data = {
			'LoginForm': {
				header: 'Login',
				social: true,
				formInputs: [
					{ type: 'text', placeholder: 'Login' },
					{ type: 'password', placeholder: 'Password' }
				],
				button: 'Login'
			}
		};
		this._View.constructPage(data);
		this._View.showPage();
	}
}

export default LoginController;
