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
        this.addAction('index', this.actionGetLobbies);
        this.addAction('create', this.actionCreateLobby);
    }

    subscribeEvents() {
        const EventBus = this.ServiceManager.EventBus;
        EventBus.subscribe('WS:Lobbies', this.showLobbies, this);
        EventBus.subscribe('WS:OneLobbyInfo', this.addLobbyInList, this);
        EventBus.subscribe('logout', () => {
            this.showLobbies();
        }, this);
        EventBus.subscribe('login', () => {
            if (this.ServiceManager.Router.getCurrentUrlPath === '/lobby') {
                this.actionGetLobbies();
            }
        }, this);
    }

    actionStub() {
        this.ServiceManager.Router.re('/play');
    }

    actionGetLobbies() {
        const loggedin = this.ServiceManager.UserStorage.getBooleanData('loggedin');
        if (loggedin) {
            this.LobbyModel.getLobbies();
        } else {
            this.showLobbies();
        }
    }

    actionCreateLobby() {
        const pageData = {
            'CreateLobby': {
                loggedIn: this.ServiceManager.UserStorage.getBooleanData('loggedin')
            }
        };
        this.LobbyView.constructCreation(pageData);
        // const object = {
        //     "class": "LobbyMessage",
        //     "action": "CREATE",
        //     "settings": {
        //         "gameTime": 60,
        //         "fieldSize": 5,
        //         "isMultiplayer": true,
        //         "name": "Hello go fight!"
        //     }
        // }
        
        // this.ServiceManager.Net.send(object);
    }

    showLobbies(data = null) {
        const pageData = {
            'Lobby': {
                loggedIn: this.ServiceManager.UserStorage.getBooleanData('loggedin'),
                lobby: data,
            }
        };
        this.LobbyView.constructPage(pageData);
    }

    addLobbyInList(data = null) {
        this.LobbyView.addLobbyInList(data);
    }
    
}

export default LobbyController;