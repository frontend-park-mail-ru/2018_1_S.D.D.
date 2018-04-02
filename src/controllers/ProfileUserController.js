'use strict';

import Controller from './Controller';
import UserModel from '../models/UserModel';
import ProfileUserView from '../views/ProfileUserView';

class ProfileUserController extends Controller {
	/**
	 * Creates instance of ProfileUserController
	 */
	constructor() {
		super();
		if (ProfileUserController.__instance) {
			return ProfileUserController.__instance;
		}
		ProfileUserController.__instance = this;

		this.UserModel = new UserModel();
		this.UserView = new ProfileUserView();
	}

	/**
	 * Defines forms reload actions after users data changes.
	 */
	subscribeProfileActions() {
		const EventBus = this.ServiceManager.EventBus;

		const nicknameChangedOff = EventBus.subscribe('nicknameChanged', () => {
			const data = {
				'Profile': this.getProfileData()
			};
			this.UserView.reloadProfile(data);
		}, this);
		EventBus.subscribe('logout', nicknameChangedOff, this, true);

		const avatarUploadedOff = EventBus.subscribe('avatarUploaded', () => {
			const data = {
				'ProfileAvatar': this.getAvatar()
			};
			this.UserView.reloadAvatar(data);
		}, this);
		EventBus.subscribe('logout', avatarUploadedOff, this, true);

		const gamesChangedOff = EventBus.subscribe('countGamesChanged', () => {
			const data = {
				'Profile': this.getProfileData()
			};
			this.UserView.reloadProfile(data);
		}, this);
		EventBus.subscribe('logout', gamesChangedOff, this, true);

		const winsChangedOff = EventBus.subscribe('countWinsChanged', () => {
			const data = {
				'Profile': this.getProfileData()
			};
			this.UserView.reloadProfile(data);
		}, this);
		EventBus.subscribe('logout', winsChangedOff, this, true);

		const ratingChangedOff = EventBus.subscribe('ratingChanged', () => {
			const data = {
				'Profile': this.getProfileData()
			};
			this.UserView.reloadProfile(data);
		}, this);
		EventBus.subscribe('logout', ratingChangedOff, this, true);

		EventBus.subscribe('logout', () => {
			this.UserView.destroyProfile();
			this.subscribed = false;
		}, this);

		this.subscribed = true;
	}

	/**
	 * Show user profile.
	 */
	actionIndex() {
		if (!this.subscribed) {
			this.subscribeProfileActions();
		}

		const data = {
			'Header': this.getHeaderData(),
			'Profile': this.getProfileData(),
			'ProfileAvatar': this.getAvatar()
		};

		this.UserView.constructProfile(data);
		this.UserView.showProfile();
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
}

export default ProfileUserController;
