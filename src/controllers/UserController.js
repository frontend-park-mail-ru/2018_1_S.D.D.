'use strict';

import Controller from './Controller';
import SettingsController from './SettingsUserController';
import ProfileController from './ProfileUserController';
import UserModel from '../models/UserModel';
import UserView from '../views/UserView';

class UserController extends Controller {
	/**
	 * Creates instance of UserController
	 */
	constructor() {
		super();
		if (UserController.__instance) {
			return UserController.__instance;
		}
		UserController.__instance = this;

		this.UserModel = new UserModel();
		this.UserView = new UserView();
		this.SettingsController = new SettingsController();
		
		this.addActions();
		this.reloadHeaderOnChange();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('profile', this.actionProfile);
		this.addAction('logout', this.actionLogout);
		this.addAction('settings', this.actionSettings);
		this.addAction('edit', this.actionEdit);
		this.addAction('uploadavatar', this.actionUploadAvatar);
	}

	actionSettings() {
		new SettingsController().actionIndex();
	}

	actionEdit(editParam) {
		new SettingsController().actionEdit(editParam);
	}

	actionUploadAvatar() {
		new SettingsController().actionUploadAvatar();
	}

	actionProfile() {
		new ProfileController().actionIndex();
	}

	/**
	 * Defines header reload actions after users data changes.
	 */
	reloadHeaderOnChange() {
		const EventBus = this.ServiceManager.EventBus;
		
		const reloadHeader = () => {
			const data = {
				'Header': this.getHeaderData()
			};
			this.UserView.reloadHeader(data);
		};

		EventBus.subscribe('nicknameChanged', reloadHeader, this);
		EventBus.subscribe('avatarChanged', reloadHeader, this);

		EventBus.subscribe('login', reloadHeader, this);
		EventBus.subscribe('logout', reloadHeader, this);
	}

	/**
	 * Set login/logout callbacks and load user if logged in.
	 */
	actionIndex() {
		const UserStorage = this.ServiceManager.UserStorage;
		const EventBus = this.ServiceManager.EventBus;

		if (!EventBus.eventExists('loggedin')) {
			EventBus.subscribe('loggedin');
			EventBus.subscribe('login', this.onLoginAction, this);
			EventBus.subscribe('logout', this.onLogoutAction, this);

			UserStorage.onChange('loggedin', () => {	
				const loggedin = UserStorage.getBooleanData('loggedin');
				if (loggedin) {
					EventBus.emit('login');
				} else {
					EventBus.emit('logout');
				}
			}, this);
		}
		
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

		this.UserView.constructLogin();

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
		this.UserView.reloadHeader(data);

		if (currentControler === 'user') {
			Router.re('/');
		} else {
			Router.loadPage();
		}
	}

	/**
	 * Logout action. Delete user from current session. Delete user templates.
	 */
	actionLogout() {
		this.UserModel.logout();
	}
}

export default UserController;
