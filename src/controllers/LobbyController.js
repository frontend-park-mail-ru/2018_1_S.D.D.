'use strict';

import Controller from './Controller';
import LobbyView from '../views/LobbyView';
import LobbyModel from '../models/LobbyModel';

class LobbyController extends Controller {
    constructor() {
        super();    
        if (LobbyController.__instance) {
            return LobbyController.__instance;
        }    
        LobbyController.__instance = this;
        
        this.LobbyView = new LobbyView();
        this.LobbyModel = new LobbyModel();
        this.addActions();
        this.subscribeEvents();
    }

    addActions() {
        this.addAction('index', this.actionStub);
    }

    subscribeEvents() {
        const EventBus = this.ServiceManager.EventBus;
        EventBus.subscribe('showLobbies', this.showLobbies, this);
    }

    actionStub() {
        this.ServiceManager.Router.re('/play');
    }

    actionShowLobbies() {
        this.LobbyModel.getLobbies();
    }

    showLobbies(data) {
        const pageData = {
            'Lobby': data,
        };
        this.LobbyView.constructPage(pageData);
    }
    
}

export default LobbyController;