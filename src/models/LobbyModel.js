'use strict';

import Model from './Model';

/**
 * Creates instance of LobbyModel
 * 
 * @class
 * @classdesc Lobby model. Provide data for template rendering.
 */
class LobbyModel extends Model {
    /**
     * Creates instance of LobbyModel
     */
    constructor() {
        super();
    }

    getLobbies() {
        const Net = this.ServiceManager.Net;
        Net.send({class: 'ShowLobbies$Request'});
    }
}

export default LobbyModel;
