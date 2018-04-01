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
		this.reloadHeaderOnChange();
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
	 * Defines header reload actions after users data changes.
	 */
	reloadHeaderOnChange() {
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;
		
		const reloadHeader = () => {
			const data = {
				'Header': this.getHeaderData()
			};
			this.UserView.reloadHeader(data);
		};

		EventBus.subscribe('nicknameChanged', reloadHeader, this);
		UserStorage.onChange('nickname', () => {
			EventBus.emit('nicknameChanged');
		});

		EventBus.subscribe('avatarUploaded', reloadHeader, this);
		UserStorage.onChange('avatar', () => {
			EventBus.emit('avatarUploaded');
		});
	}

	/**
	 * Set login/logout callbacks and load user if logged in.
	 */
	actionIndex() {
		const UserStorage = this.ServiceManager.UserStorage;
		const EventBus = this.ServiceManager.EventBus;

		EventBus.subscribe('login', this.onLoginAction, this);
		EventBus.subscribe('logout', this.onLogoutAction, this);

		UserStorage.onChange('loggedin', () => {
			const EventBus = this.ServiceManager.EventBus;		
			const loggedin = this.ServiceManager.UserStorage.getBooleanData('loggedin');
			if (loggedin) {
				EventBus.emit('login');
			} else {
				EventBus.emit('logout');
			}
		}, this);
		
		this.UserModel.loadUser();
	}

	/**
	 * What to do after user logged in.
	 */
	onLoginAction() {
		const Router = this.ServiceManager.Router;
		const currentUrl = Router.getCurrentUrlPath();
		const currentControler = Router.getController(currentUrl);
		const currentAction = Router.getAction(currentUrl);

		const data = {
			'Header': this.getHeaderData(),
		};
		this.UserView.constructLogin(data);

		if (
			currentControler === 'login' || 
			currentControler === 'signup' ||
			(currentControler === 'user' && currentAction === 'index')
		) {
			Router.re('/');
		} else {
			Router.loadPage();
		}
	}

	/**
	 * What to do after user logged out.
	 */
	onLogoutAction() {
		const Router = this.ServiceManager.Router;
		const currentUrl = Router.getCurrentUrlPath();
		const currentControler = Router.getController(currentUrl);

		const data = {
			'Header': this.getHeaderData(),
		};
		this.UserView.constructLogout(data);

		if (currentControler === 'user') {
			Router.re('/');
		} else {
			Router.loadPage();
		}
	}

	/**
	 * Show user profile.
	 */
	actionProfile() {
		const data = {
			'Header': this.getHeaderData(),
			'Profile': this.getProfileData(),
			'ProfileAvatar': this.getAvatar()
		};

		this.UserView.constructProfile(data);
		this.UserView.showProfile();
	}

	/**
	 * Show form with user`s settings
	 */
	actionSettings() {
		const data = this._getSettingsData();
		const EventBus = this.ServiceManager.EventBus;
		const UserStorage = this.ServiceManager.UserStorage;

		EventBus.subscribe('nicknameChanged', () => {
			const data = this._getSettingsData();
			this.UserView.reloadForm('EditNickname', data);
		}, this);

		EventBus.subscribe('avatarUploaded', () => {
			const data = this._getSettingsData();
			this.UserView.reloadAvatar(data);
		}, this);

		EventBus.subscribe('emailChanged', () => {
			const data = this._getSettingsData();
			this.UserView.reloadForm('EditEmail', data);
		}, this);
		UserStorage.onChange('email', () => {
			EventBus.emit('emailChanged');
		});

		EventBus.subscribe('passwordChanged', () => {
			const data = this._getSettingsData();
			this.UserView.reloadForm('EditPassword', data);
		}, this);

		this.UserView.constructSettings(data);
		this.UserView.showSettings();
	}

	/**
	 * Upload users avatar.
	 */
	actionUploadAvatar() {
		let submitData = this.UserView.serializeAvatar();
		if (!submitData) {
			const data = this._getSettingsData();
			this.UserView.constructPage(data);
			submitData = this.UserView.serializeAvatar();
		}

		const EventBus = this.ServiceManager.EventBus;
		if (!EventBus.eventExists('avatarUploadingError')) {
			EventBus.subscribe('avatarUploadingError', errors => {
				for (let e in errors) {
					this.UserView.addFormError('UploadAvatar', e, errors[e]);
				}
			}, this);
		}

		this.UserModel.uploadAvatar(submitData);
	}

	/**
	 * Submit action. Edit user settings. Validate form and submit data to server if ok.
	 * 
	 * @param {string} editParam Contains what to edit
	 */
	actionEdit(editParam) {
		if (!editParam || editParam === '') {
			this.go('/error/404', false);
			return;
		}
		
		let formTemplate = '';
		switch (editParam) {
		case 'nickname':
			formTemplate = 'EditNickname';
			break;
		case 'email':
			formTemplate = 'EditEmail';
			break;
		case 'password':
			formTemplate =  'EditPassword';
			break;
		default:
			this.go('/error/404', false);
			return;
		}

		let submitData = this.UserView.serializeForm(formTemplate);
		if (!submitData) {
			const data = this._getSettingsData();
			this.UserView.constructSettings(data);
			submitData = this.UserView.serializeForm(formTemplate);
		}
		
		const EventBus = this.ServiceManager.EventBus;
		EventBus.subscribe(`edit${editParam}Error`, errors => {
			for (let e in errors) {
				this.UserView.addFormError(formTemplate, e, errors[e]);
			}
			this.go('/user/settings');
		}, this);
		
		switch (editParam) {
		case 'nickname':
			this.UserModel.editNickname(submitData);
			break;
		case 'email':
			this.UserModel.editEmail(submitData);
			break;
		case 'password':
			this.UserModel.editPassword(submitData);
			break;
		}
	}

	/**
	 * Logout action. Delete user from current session. Delete user templates.
	 */
	actionLogout() {
		this.UserModel.logout();
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
			nickname: UserStorage.getData('nickname'),
			gamesCount: UserStorage.getData('countGames'),
			winsCount: UserStorage.getData('countWins'),
			rating: UserStorage.getData('rating'),
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
			defaultAvatar: UserStorage.getData('avatar') === 'null',
			avatar: UserStorage.getData('avatar'),
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
					placeholder: UserStorage.getData('nickname'),
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
					placeholder: UserStorage.getData('email'),
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
