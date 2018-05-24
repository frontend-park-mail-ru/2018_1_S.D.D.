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
        this.isOwner = false;
        
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
        EventBus.subscribe('WS:OneLobbyInfo', this.connectToMyLobby, this);
        EventBus.subscribe('WS:LobbyConnected', this.connectToLobby, this);
        EventBus.subscribe('WS:LobbyStateMessage', this.changedState, this);
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
        const pageData = {
            'Room': {
                owner: SessionSettings.players[0],
                isOwner: true,
                lobbyname: SessionSettings.lname,
                mode: SessionSettings.mode,
                field: SessionSettings.size,
                time: SessionSettings.time
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

    connectToMyLobby(data = null) {
        if (data.owner === this.ServiceManager.UserStorage.getData('nickname')) {
            SessionSettings.mode = 'multiplayer';
            SessionSettings.time = data.gameTime;
            SessionSettings.size = data.fieldSize;
            SessionSettings.lname = data.name;
            this.isOwner = true;
            const US = this.ServiceManager.UserStorage;

            const owner = {};

            if (US.getBooleanData('loggedin')) {
                owner.name = US.getData('nickname');
                owner.avatar = US.getData('avatar') !== 'null' ? US.getData('avatar') : defaultAvatar;
            }
            SessionSettings.players[0] = owner;
            this.ServiceManager.Router.re(`/lobby/room/${data.id}`);
        }
    }

    addLobbyInList(data = null) {
        this.LobbyView.addLobbyInList(data);
    }

    connectToLobby(data = null) {
        // tut sdelat cherez sessionsettings kak na 131 str
        this.isOwner = false;
        let players = [];
        data.users.forEach(user => {
            players.push({
                avatar: defaultAvatar,
                name: user
            });
        });

        const US = this.ServiceManager.UserStorage;
        const me = {};
        me.name = US.getData('nickname');
        me.avatar = US.getData('avatar') !== 'null' ? US.getData('avatar') : defaultAvatar;

        players.push(me);

        const pageData = {
            'Room': {
                owner: false,
                isOwner: false,
                lobbyname: data.name,
                mode: 'multiplayer',
                field: data.fieldSize,
                time: data.gameTime,
                players: players
            }
        };
        
        this.LobbyView.constructRoom(pageData);
    }

    changedState(data = null) {
        switch (data.action) {
        case 'CONNECTED':
            this.LobbyView.addPlayersToRoom([{
                avatar: defaultAvatar,
                name: data.nickname
            }], this.isOwner);
            break;
        }
    }
    
}

export default LobbyController;