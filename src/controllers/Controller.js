'use strict';

import ServiceManager from '../modules/ServiceManager';

/** 
 * @class
 * @classdesc Base controller class. Defined actionIndex method.
*/
class Controller {
    /**
     * Creates instance if Controller
     */
    constructor() {
        this.ServiceManager = new ServiceManager();
        this._actions = {
            index: () => {},
            close: () => {}
        };

        const EventBus = this.ServiceManager.EventBus;
        if (!EventBus.eventExists('error:nologin')) {
            EventBus.subscribe('error:nologin', this.noLoginError, this);
            EventBus.subscribe('error:noresponse', this.noResponseError, this);
        }
    }

    /**
     * 
     * @param {string} action Action name.
     * @param {Function} callback Function to call.
     */
    addAction(action, callback) {
        this._actions[action] = callback.bind(this);
    }

    /**
     * Searches for action and executes it.
     * 
     * @param {string} action Action name.
     * @param {string[]} parameters Parameters for action.
     * @returns {boolean} True if action executed. False if bot found (404).
     */
    action(action, parameters = []) {
        const callback = this._actions[action];
        if (!callback) {
            return false;
        }
        callback(...parameters);
        return true;
    }

    /**
     * Load new page.
     * 
     * @param {string} url Page url.
     */
    go(url, history = true) {
        this.ServiceManager.Router.go(url, history);
    }

    /**
     * Get data for header rendering
     */
    getHeaderData() {
        const User = this.ServiceManager.UserStorage;
        
        return {
            loggedIn: User.getBooleanData('loggedin'),
            nickname: User.getData('nickname'),
            defaultAvatar: User.getData('avatar') != 'null' ? false : true,
            avatar: User.getData('avatar'),
            menuItems: [
                { link:'/user/profile', text:'PROFILE' },
                { link:'/user/settings', text:'SETTINGS' },
                { link:'/user/logout', text:'LOG OUT', nohistory: 'true' }
            ]
        };
    }

    noLoginError() {
        this.go('/error/403', false);
    }

    noResponseError() {
        this.go('/error/503', false);
    }

    onPageLeave() {
        return true;
    }
}

export default Controller;
