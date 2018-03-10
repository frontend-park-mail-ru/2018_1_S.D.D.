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
