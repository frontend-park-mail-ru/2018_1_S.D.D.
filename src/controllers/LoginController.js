'use strict';

import Controller from './Controller';
import UserModel from '../models/UserModel';
import LoginView from '../views/LoginView';
import validation from '../modules/validations';

class LoginController extends Controller {
	/**
	 * Creates instance of LoginController
	 */
	constructor() {
		super();
		this.UserModel = new UserModel();
		this.LoginView = new LoginView();
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
	 * Common action. Show login form.
	 */
	actionIndex() {
		this.UserModel.loadUser(
			() => {
				this._loginCallback();
			},
			() => {
				const data = {
					'LoginForm': this.getLoginForm(),
					'Header': this.getHeaderData()
				};
				
				this.LoginView.constructPage(data);
				this.LoginView.showPage();
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
					'LoginForm': this.getLoginForm(),
					'Header': this.getHeaderData()
				};
				
				let submitData = this.LoginView.serializeForm();
				if(!submitData) {
					this.LoginView.constructPage(data);
					submitData = this.LoginView.serializeForm();
				}

				this.UserModel.login(
					submitData,
					() => {
						const reconstructData = {
							'Header': this.getHeaderData()
						};
						this.LoginView.reconstructPage(reconstructData);
						this.go('/');
					},
					errors => {
						for(let e in errors) {
							this.LoginView.addFormError(e, errors[e]);
						}
						this.go('/login');
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
		this.LoginView.reconstructPage(data);
		this.go('/');
	}

	/**
	 * Get data for rendering login form.
	 * 
	 * @returns {Object} Contains data for template rendering.
	 */
	getLoginForm() {
		return {
			back: true,
			header: 'COME IN!',
			social: true,
			formAction: '/login/submit',
			onSubmit: () => this.go('/login/submit', false),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: 'Login',
					validateMethod: validation.login,
					validateFields: ['nickname']
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'Password',
					validateMethod: validation.login,
					validateFields: ['password']
				}
			],
			button: 'LOG IN'
		};
	}

}

export default LoginController;
