'use strict';

import Controller from './Controller';
import LobbyView from '../views/LobbyView';
import LobbyModel from '../models/LobbyModel';
import defaultAvatar from '../modules/game/bin/1.svg'; 
import SessionSettings from '../modules/game/SessionSettings';

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
        this.addAction('room', this.actionOnlineLobby);
        this.addAction('offline', this.actionOfflineLobby);
    }

    subscribeEvents() {
        const EventBus = this.ServiceManager.EventBus;
        EventBus.subscribe('WS:Lobbies', this.showLobbies, this);
        EventBus.subscribe('WS:OneLobbyInfo', this.addLobbyInList, this);
        EventBus.subscribe('WS:OneLobbyInfo', this.connectToLobby, this);
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
    }

    actionOnlineLobby() {
        const Router = this.ServiceManager.Router;
        const field = Router.getAdditionalParams('field');
        const time = Router.getAdditionalParams('time');

        const US = this.ServiceManager.UserStorage;
        let username = 'Mr. Incognito';
        let useravatar = defaultAvatar;
        const owner = {
            name: username,
            avatar: useravatar
        };

        if (US.getBooleanData('loggedin')) {
            owner.name = US.getData('nickname');
            owner.avatar = US.getData('avatar') !== 'null' ? US.getData('avatar') : useravatar;
        }
        const pageData = {
            'Room': {
                owner: owner,
                isOwner: true,
                lobbyname: 'OFFLINE Lobby',
                mode: 'offline',
                field: field,
                time: time
            }
        };
        
        this.LobbyView.constructRoom(pageData);
    }

    actionOfflineLobby() {
        const Router = this.ServiceManager.Router;
        const field = Router.getAdditionalParams('field');
        const time = Router.getAdditionalParams('time');

        const US = this.ServiceManager.UserStorage;
        let username = 'Mr. Incognito';
        let useravatar = defaultAvatar;
        const owner = {
            name: username,
            avatar: useravatar
        };

        if (US.getBooleanData('loggedin')) {
            owner.name = US.getData('nickname');
            owner.avatar = US.getData('avatar') !== 'null' ? US.getData('avatar') : useravatar;
        }
        const pageData = {
            'Room': {
                owner: owner,
                isOwner: true,
                lobbyname: 'OFFLINE Lobby',
                mode: 'offline',
                field: field,
                time: time
            }
        };
        SessionSettings.mode = 'offline';
        SessionSettings.time = time;
        SessionSettings.size = field;
        SessionSettings.players.push(owner);
        this.LobbyView.constructRoom(pageData);
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

    connectToLobby(data = null) {
        if (data.owner === this.ServiceManager.UserStorage.getData('nickname')) {
            SessionSettings.mode = 'offline';
            SessionSettings.time = data.gameTime;
            SessionSettings.size = data.fieldSize;
            
            const US = this.ServiceManager.UserStorage;
            let username = 'Mr. Incognito';
            let useravatar = defaultAvatar;
            const owner = {
                name: username,
                avatar: useravatar
            };

            if (US.getBooleanData('loggedin')) {
                owner.name = US.getData('nickname');
                owner.avatar = US.getData('avatar') !== 'null' ? US.getData('avatar') : useravatar;
            }
            SessionSettings.players.push(owner);
            this.ServiceManager.Router.re(`/lobby/room/${data.id}`);
        }
    }

    addLobbyInList(data = null) {
        this.LobbyView.addLobbyInList(data);
    }
    
}

export default LobbyController;