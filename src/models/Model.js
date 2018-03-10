'use strict';

import ServiceManager from '../modules/ServiceManager';

/**
 * Creates instance of Model
 * 
 * @class
 * @classdesc Base model. Provide acces to ServiceManager.
 */
class Model {
	/**
	 * Creates instance of Model
	 */
	constructor() {
		this._ServiceManager = new ServiceManager();
	}

	getHeaderData() {
		const User = this._ServiceManager.User;
		return {
			loggedIn: User.isLogged(),
			nickname: User.nickname,
			defaultAvatar: User.defaultAvatar,
			avatar: User.avatar,
			menuItems: [
				{ link:'/user/profile', text:'PROFILE' },
				{ link:'/user/logout', text:'LOG OUT', nohistory: 'true' }
			]
		};
	}
	
}

export default Model;
