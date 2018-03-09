'use strict';

import Controller from './Controller';
import SignupModel from '../models/SignupModel';
import SignupView from '../views/SignupView';

class SignupController extends Controller {
	/**
	 * Creates instance of SignupController
	 */
	constructor() {
		super();
		this._Model = new SignupModel();
		this._View = new SignupView();
		this.addActions();
		this.data = {
			'SignupForm': this._Model.getSignupForm(
				() => this._ServiceManager.Router.go('/signup/submit', false)
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
	 * Common action. Show signup form.
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
			this._Model.signup(
				submitData,
				() => {
					// success behaviour here
				},
				errors => {
					for(let e in errors) {
						this._View.addFormError(e, errors[e]);
					}
					this.go('/signup');
				}
			);
		} else {
			this.go('/signup');
		}
	}
}

export default SignupController;
