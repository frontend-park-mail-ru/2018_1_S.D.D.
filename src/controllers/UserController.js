'use strict';

import Controller from './Controller';
import UserModel from '../models/UserModel';
import UserView from '../views/UserView';
import validation from '../modules/validations';

class UserController extends Controller {
	/**
	 * Creates instance of UserController
	 */
	constructor() {
		super();
		this.UserModel = new UserModel();
		this.UserView = new UserView();
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
		this.addAction('uploadavatar', this.actionUploadAvatar);
		this.addAction('logout', this.actionLogout);
	}

	/**
	 * Load user if logged in.
	 */
	actionIndex() {
		const onCheckCallback = () => {
			const Router = this.ServiceManager.Router;
			const currentUrl = Router.getCurrentUrlPath();
			const currentControler = Router.getController(currentUrl);

			// If user typed in url /user - we need to redirect him to menu
			if(currentControler === 'user') {
				const currentAction = Router.getAction(currentUrl);
				if(!currentAction || currentAction === 'index' || currentAction === '') {
					Router.re('/');
					return;
				}
			}
			Router.loadPage();
		};

		this.UserModel.loadUser(
			onCheckCallback,
			onCheckCallback,
			() => this.go('/error/503', false)
		);
	}

	/**
	 * Show user profile.
	 */
	actionProfile() {
		this.UserModel.loadUser(
			() => {
				const data = {
					'Header': this.getHeaderData(),
					'Profile': this.getProfileData(),
					'ProfileAvatar': this.getAvatar()
				};
				this.UserView.constructProfile(data);
				this.UserView.showProfile();
			},
			() => this.go('/error/403', false),
			() => this.go('/error/503', false)
		);
	}

	/**
	 * Show form with user`s settings
	 */
	actionSettings() {
		this.UserModel.loadUser(
			() => {
				const data = this._getSettingsData();
				this.UserView.constructSettings(data);
				this.UserView.showSettings();
			},
			() => this.go('/error/403', false),
			() => this.go('/error/503', false)
		);
	}

	/**
	 * Upload users avatar.
	 */
	actionUploadAvatar() {
		this.UserModel.loadUser(
			() => {
				let submitData = this.UserView.serializeAvatar();
				if(!submitData) {
					const data = this._getSettingsData();
					this.UserView.constructPage(data);
					submitData = this.UserView.serializeAvatar();
				}
				
				this.UserModel.uploadAvatar(
					submitData,
					() => {
						const data = {
							'Header': this.getHeaderData(),
							'UploadAvatar': this.getUploadAvatar(),
							'Avatar': this.getAvatar()
						};
						this.UserView.reloadAvatar(data);
					},
					errors => {
						for(let e in errors) {
							this.UserView.addFormError('UploadAvatar', e, errors[e]);
						}
					}
				);
			},
			() => this.go('/error/403', false),
			() => this.go('/error/403', false)
		);
	}

	/**
	 * Submit action. Edit user settings. Validate form and submit data to server if ok.
	 * 
	 * @param {string[]} parameters Contains what to edit
	 */
	actionEdit(parameters = []) {
		this.UserModel.loadUser(
			() => {
				const editParam = parameters[0];
				if(!editParam) {
					this.go('/error/404', false);
				}

				const formTemplate = this._getTemplate(editParam);

				let submitData = this.UserView.serializeForm(formTemplate);
				if(!submitData) {
					const data = this._getSettingsData();
					this.UserView.constructPage(data);
					submitData = this.UserView.serializeForm(formTemplate);
				}

				const errorCallback = errors => {
					for(let e in errors) {
						this.UserView.addFormError(formTemplate, e, errors[e]);
					}
					this.go('/user/settings');
				};
				
				this._editUserData(editParam, submitData, errorCallback);

			},
			() => this.go('/error/403', false),
			() => this.go('/error/503', false)
		);
	}

	/**
	 * Logout action. Delete user from current session. Delete user templates.
	 * 
	 * @param parameters Contains flag if we need go to menu page.
	 */
	actionLogout(parameters = []) {
		const goToMenu = parameters[0] !== 'quietly';
		this.UserModel.logout(
			() => {
				const reconstructData = {
					'Header': this.getHeaderData()
				};
				this.UserView.constructLogout(reconstructData);
				if(goToMenu) {
					this.go('/');
				}
			},
			() => this.go('/error/503', false)
		);
	}

	/**
	 * Request to server to edit user data.
	 * 
	 * @param {string} editParam Parameter from url - property to edit.
	 * @param {Object} submitData Serialized data from form.
	 * @param {Function} onErrorCallback What to do if there will be errors in request.
	 */
	_editUserData(editParam, submitData, onErrorCallback) {
		switch(editParam) {
		case 'nickname':
			this.UserModel.editNickname(
				submitData,
				() => {
					const data = {
						'Header': this.getHeaderData(),
						'EditNickname': this.getEditNickname()
					};
					this.UserView.reloadForm('EditNickname', data);
					this.UserView.reloadHeader(data);
				},
				onErrorCallback
			);
			break;
		case 'email':
			this.UserModel.editEmail(
				submitData,
				() => {
					const data = {
						'EditEmail': this.getEditEmail()
					};
					this.UserView.reloadForm('EditEmail', data);
				},
				onErrorCallback
			);
			break;
		case 'password':
			this.UserModel.editPassword(
				submitData,
				() => {
					const data = {
						'EditPassword': this.getEditPassword()
					};
					this.UserView.reloadForm('EditPassword', data);
				},
				onErrorCallback
			);
			break;
		}
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
	 * Get data for settings page rendering.
	 * 
	 * @returns {Object} Data for rendering.
	 */
	_getSettingsData() {
		return {
			'Header': this.getHeaderData(),
			'EditNickname': this.getEditNickname(),
			'EditEmail': this.getEditEmail(),
			'EditPassword': this.getEditPassword(),
			'UploadAvatar': this.getUploadAvatar(),
			'Avatar': this.getAvatar()
		};
	}

	/**
	 * Get data for rendering profile template.
	 * 
	 * @returns {Object} Contains data for template rendering.
	 */
	getProfileData() {
		const UserStorage = this.ServiceManager.UserStorage;
		return {
			url: '/',
			nickname: UserStorage.nickname,
			gamesCount: UserStorage.games,
			winsCount: UserStorage.wins,
			rating: UserStorage.rating,
		};
	}

	/**
	 * If user uploaded avatar will contain path to this avatar.
	 * 
	 * @returns {Object} Contains flag of default avatar and path to users avatar.
	 */
	getAvatar() {
		const UserStorage = this.ServiceManager.UserStorage;
		return {
			defaultAvatar: UserStorage.defaultAvatar,
			avatar: UserStorage.avatar
		};
	}

	/**
	 * Get data for rendering nickname form.
	 * 
	 * @returns {Object} Contains data for template rendering.
	 */
	getEditNickname() {
		const UserStorage = this.ServiceManager.UserStorage;
		return {
			back: true,
			header: false,
			social: false,
			formAction: '/user/edit/nickname',
			onSubmit: () => this.go('/user/edit/nickname', false),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: UserStorage.nickname,
					validateMethod: validation.login,
					validateFields: ['nickname']
				}
			],
			button: 'CHANGE NICKNAME!'
		};
	}

	/**
	 * Get data for rendering email form.
	 * 
	 * @returns {Object} Contains data for template rendering.
	 */
	getEditEmail() {
		const UserStorage = this.ServiceManager.UserStorage;
		return {
			header: false,
			social: false,
			formAction: '/user/edit/email',
			onSubmit: () => this.go('/user/edit/email', false),
			formInputs: [
				{
					type: 'text',
					name: 'email',
					placeholder: UserStorage.email,
					validateMethod: validation.email,
					validateFields: ['email']
				}
			],
			button: 'CHANGE EMAIL!'
		};
	}

	/**
	 * Get data for rendering password form.
	 * 
	 * @returns {Object} Contains data for template rendering.
	 */
	getEditPassword() {
		return {
			header: false,
			social: false,
			formAction: '/user/edit/password',
			onSubmit: () => this.go('/user/edit/password', false),
			formInputs: [
				{
					type: 'password',
					name: 'oldPassword',
					placeholder: 'Old password',
					validateMethod: validation.password,
					validateFields: ['oldPassword']
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'New password',
					validateMethod: validation.password,
					validateFields: ['password', 'passwordCheck']
				},
				{
					type: 'password',
					name: 'passwordCheck',
					placeholder: 'Confirm password',
					validateMethod: validation.password,
					validateFields: ['passwordCheck', 'password']
				}
			],
			button: 'CHANGE PASSWORD!'
		};
	}

	/**
	 * Get data for rendering avatar form.
	 * 
	 * @returns {Object} Contains data for template rendering.
	 */
	getUploadAvatar() {
		return {
			header: false,
			social: false,
			formAction: '/user/uploadavatar',
			onSubmit: () => this.go('/user/uploadavatar', false),
			formInputs: [
				{
					type: 'file',
					name: 'file',
					placeholder: 'Photo upload'
				}
			],
			button: 'UPLOAD PHOTO!'
		};
	}
}

export default UserController;
