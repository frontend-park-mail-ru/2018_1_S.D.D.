'use strict';

import Model from './Model';

/**
 * Creates instance of UserModel
 * 
 * @class
 * @classdesc User model. Provide data for template rendering.
 */
class UserModel extends Model {
	/**
	 * Creates instance of UserModel
	 */
	constructor() {
		super();
	}

	getProfileData(backUrl = '/') {
		const User = this._ServiceManager.User;
		return {
			url: backUrl,
			nickname: User.nickname,
			gamesCount: User.games,
			winsCount: User.wins,
			rating: User.rating,
		};
	}

	getSettingsData(onSubmitCallback) {
		const User = this._ServiceManager.User;
		return this.defaultLoginForm = {
			header: 'EDIT PROFILE',
			social: false,
			formAction: '/user/edit',
			onSubmit: () => onSubmitCallback(),
			formInputs: [
				{
					type: 'text',
					name: 'nickname',
					placeholder: User.nickname
				},
				{
					type: 'text',
					name: 'email',
					placeholder: User.email
				},
				{
					type: 'password',
					name: 'oldPassword',
					placeholder: 'Old password'
				},
				{
					type: 'password',
					name: 'password',
					placeholder: 'New password'
				},
				{
					type: 'password',
					name: 'passwordCheck',
					placeholder: 'Confirm password'
				}
			],
			button: 'CHANGE MYSELF!'
		};
	}

	logout(onSuccessCallback, onErrorCallback) {
		const User = this._ServiceManager.User;
		if(User.isLogged()) {
			User.logout()
				.then(() => {
					onSuccessCallback();
				})
				.catch(() => {
					onErrorCallback();
				});
		} else {
			onSuccessCallback();
		}
	}


}

export default UserModel;
