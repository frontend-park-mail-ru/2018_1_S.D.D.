'use strict';

import Controller from './Controller';
import LoginModel from '../models/LoginModel';
import LoginView from '../views/LoginView';

class LoginController extends Controller {
	/**
	 * Creates instance of LoginController
	 */
	constructor() {
		super();
		this._Model = new LoginModel();
		this._View = new LoginView();
		this.addActions();
		this.data = {
			'LoginForm': this._Model.getLoginForm(
				() => this._ServiceManager.Router.go('/login/submit', false)
			)
		};
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('submit', this.actionSubmit);
	}

	/**
	 * Common action. Show login form.
	 */
	actionIndex() {
		this._View.constructPage(this.data);
		this._View.showPage();
	}

	/**
	 * Submit action. Validate form and submit data to server if ok.
	 */
	actionSubmit() {
		let submitData = this._View.serializeForm();
		if(!submitData) {
			this._View.constructPage(this.data);
			submitData = this._View.serializeForm();
		}

		const validation = this._Model.validate(submitData);

		let noValidationError = true;
		for(let input in validation) {
			if(validation[input]) {
				this._View.addFormError(input, validation[input]);
				noValidationError = false;
			}
		}

		if(noValidationError) {
			this._Model.authenticate(
				submitData,
				() => {
					// success behaviour here
				},
				errors => {
					for(let e in errors) {
						this._View.addFormError(e, errors[e]);
					}
					this.go('/login');
				}
			);
		} else {
			this.go('/login');
		}
	}
}

export default LoginController;
