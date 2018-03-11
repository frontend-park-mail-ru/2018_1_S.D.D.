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
		this._Model.onAuth(
			() => {
				this._loginCallback();
			},
			() => {
				const data = {
					'SignupForm': this._Model.getSignupForm(
						() => this._ServiceManager.Router.go('/signup/submit', false)
					),
					'Header': this._Model.getHeaderData()
				};
				this._View.constructPage(data);
				this._View.showPage();
			}
		);
	}

	/**
	 * Submit action. Validate form and submit data to server if ok.
	 */
	actionSubmit() {
		this._Model.onAuth(
			this._loginCallback,
			() => {
				const data = {
					'SignupForm': this._Model.getSignupForm(
						() => this._ServiceManager.Router.go('/signup/submit', false)
					),
					'Header': this._Model.getHeaderData()
				};

				let submitData = this._View.serializeForm();
				if(!submitData) {
					this._View.constructPage(data);
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
							const reconstructData = {
								'Header': this._Model.getHeaderData()
							};
							this._View.reconstructPage(reconstructData);
							this.go('/');
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
		);
	}

	/**
	 * What to do is user already logged in.
	 */
	_loginCallback() {
		const data = {
			'Header': this._Model.getHeaderData()
		};
		this._View.reconstructPage(data);
		this.go('/');
	}
}

export default SignupController;
