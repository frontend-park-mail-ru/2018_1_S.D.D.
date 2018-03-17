'use strict';

import Controller from './Controller';
import UserModel from '../models/UserModel';
import SignupView from '../views/SignupView';
import validation from '../modules/validations';

class SignupController extends Controller {
	/**
	 * Creates instance of SignupController
	 */
	constructor() {
		super();
		this.UserModel = new UserModel();
		this.SignupView = new SignupView();
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
		this.UserModel.loadUser(
			() => {
				this._loginCallback();
			},
			() => {
				const data = {
					'SignupForm': this.getSignupForm(),
					'Header': this.getHeaderData()
				};
				this.SignupView.constructPage(data);
				this.SignupView.showPage();
			}
		);
	}

	/**
	 * Submit action. Validate form and submit data to server if ok.
	 */
	actionSubmit() {
		this.UserModel.loadUser(
			this._loginCallback,
			() => {
				const data = {
					'SignupForm': this.getSignupForm(),
					'Header': this.getHeaderData()
				};

				let submitData = this.SignupView.serializeForm();
				if(!submitData) {
					this.SignupView.constructPage(data);
					submitData = this.SignupView.serializeForm();
				}

				this.UserModel.signup(
					submitData,
					() => {
						const reconstructData = {
							'Header': this.getHeaderData()
						};
						this.SignupView.reconstructPage(reconstructData);
						this.go('/');
					},
					errors => {
						for(let e in errors) {
							this.SignupView.addFormError(e, errors[e]);
						}
						this.go('/signup');
					}
				);
			}
		);
	}

	/**
	 * What to do is user already logged in.
	 */
	_loginCallback() {
		const data = {
			'Header': this.getHeaderData()
		};
		this.SignupView.reconstructPage(data);
		this.go('/');
	}

	/**
	 * Get Signup form data.
	 * 
	 * @returns {Object} Inputs and header.
	 */
	getSignupForm() {
		return {
			back: true,
			header: 'HI STRANGER!',
			social: false,
			formAction: '/signup/submit',
			onSubmit: () => this.go('/signup/submit', false),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: 'Login',
					validateMethod: validation.login,
					validateFields: ['nickname']
				},
				{
					type: 'text',
					name: 'email',
					placeholder: 'Email',
					validateMethod: validation.email,
					validateFields: ['email']
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'Password',
					validateMethod: validation.password,
					validateFields: ['password', 'passwordCheck']
				},
				{
					type: 'password',
					name: 'passwordCheck',
					placeholder: 'Repeat password',
					validateMethod: validation.password,
					validateFields: ['passwordCheck', 'password']
				}
			],
			button: 'SIGN UP'
		};
	}
}

export default SignupController;
