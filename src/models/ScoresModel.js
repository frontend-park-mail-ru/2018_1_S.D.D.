'use strict';

import Model from './Model';

/**
 * Creates instance of ScoresModel
 * 
 * @class
 * @classdesc Scores model. Provide data for template rendering.
 */
class ScoresModel extends Model {
    /**
     * Creates instance of ScoresModel
     */
    constructor() {
        super();
        this._usersPerPage = 5;
    }

    /**
    * Get user count
    *
    * @returns {Promise} Promise contains count of registered users.
    */
    getUserCount() {
        const API = this.ServiceManager.ApiService;
        const EventBus = this.ServiceManager.EventBus;

        return API.GET('user/get_users_count')
            .then(response => {
                if (API.responseSuccess(response)) {
                    EventBus.emit('showPagination', response.data.count_users);
                } else {
                    EventBus.emit('error:noresponse');
                }
            })
            .catch(() => {
                EventBus.emit('error:noresponse');
            });
    }

    /**
    * Get current user poistion in scores table.
    *
    * @returns {Promise} Promise contains position in table.
    */
    getUserPosition(users_list) {
        const API = this.ServiceManager.ApiService;
        const EventBus = this.ServiceManager.EventBus;

        return API.GET('user/get_position')
            .then(response => {
                if (API.responseSuccess(response)) {
                    EventBus.emit('showScoresTable', [users_list, response.data.position]);
                } else {
                    EventBus.emit('showScoresTable', [users_list, -1]);
                }
            })
            .catch(() => {
                EventBus.emit('error:noresponse');
            });
    }

    /**
    * Get user scores
    *
    * @returns {Promise} Promise contains users scores
    */
    getUserScores(page) {
        const limit = this.limit;
        const offset = page * limit - limit;

        const API = this.ServiceManager.ApiService;
        const EventBus = this.ServiceManager.EventBus;
        const User = this.ServiceManager.UserStorage;

        return API.GET(`user/get_users?limit=${limit}&offset=${offset}`)
            .then(response => {
                if (API.responseSuccess(response)) {
                    response.data.users_list.userViewList.forEach((user, index) => {
                        user.place = offset + index + 1;
                    });
                    if (User.getBooleanData('loggedin')) {
                        return this.getUserPosition(response.data.users_list);
                    } else {
                        EventBus.emit('showScoresTable', [response.data.users_list, -1]);
                    }
                } else {
                    EventBus.emit('error:noresponse');
                }
            })
            .catch(() => {
                EventBus.emit('error:noresponse');
            });
    }

    get limit() {
        return this._usersPerPage;
    }
}

export default ScoresModel;
