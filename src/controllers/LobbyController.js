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
        this.inLobby = false;
        this.lobbyId = -1;
    }

    addActions() {
        this.addAction('index', this.actionGetLobbies);
        this.addAction('create', this.actionCreateLobby);
        this.addAction('room', this.actionOnlineLobby);
        this.addAction('offline', this.actionOfflineLobby);
    }

    subscribeEvents() {
        const EventBus = this.ServiceManager.EventBus;
        EventBus.subscribe('logout', this.disconnect, this);
        EventBus.subscribe('WS:Lobbies', this.showLobbies, this);
        EventBus.subscribe('WS:OneLobbyInfo', this.addLobbyInList, this);
        EventBus.subscribe('WS:OneLobbyInfo', this.connectToMyLobby, this);
        EventBus.subscribe('WS:LobbyConnected', this.connectToLobby, this);
        EventBus.subscribe('WS:LobbyStateMessage', this.changedState, this);
        EventBus.subscribe('WS:OneLobbyChanged', this.updateLobbyList, this);
        EventBus.subscribe('WS:LobbyDeletedInfo', this.deleteLobby, this);
        EventBus.subscribe('WS:GameStart', this.startGame, this);
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
        SessionSettings.lobbyId = -1;
        SessionSettings.ready = false;
        this.LobbyView.setNotReady();
        const loggedin = this.ServiceManager.UserStorage.getBooleanData('loggedin');
        //console.log(this.inLobby, this.lobbyId)
        if (this.inLobby && this.lobbyId > 0) {
            this.ServiceManager.Net.send({
                'class': 'LobbyMessage',
                'action': 'DISCONNECT',
                'id': this.lobbyId
            });
            this.inLobby = false;
            this.lobbyId = -1;
        }
        if (loggedin) {
            this.LobbyModel.getLobbies();
        } else {
            this.showLobbies();
        }
    }

    actionCreateLobby() {
        SessionSettings.lobbyId = -1;
        SessionSettings.ready = false;
        this.LobbyView.setNotReady();
        if (this.inLobby && this.lobbyId > 0) {
            this.ServiceManager.Net.send({
                'class': 'LobbyMessage',
                'action': 'DISCONNECT',
                'id': this.lobbyId
            });
            this.inLobby = false;
            this.lobbyId = -1;
        }
        const pageData = {
            'CreateLobby': {
                loggedIn: this.ServiceManager.UserStorage.getBooleanData('loggedin')
            }
        };
        this.LobbyView.constructCreation(pageData);
    }

    actionOnlineLobby(roomId = -1) {
        if (SessionSettings.players.length === 0) {
            const SM = this.ServiceManager;
            const Net = SM.Net;
            const connectRequest = {
                'class': 'LobbyMessage',
                'action': 'CONNECT',
                'id': roomId
            };
            Net.send(connectRequest);
            return;
        }
        const pageData = {
            'Room': {
                owner: SessionSettings.players[0],
                players: SessionSettings.players,
                isOwner: 
                    SessionSettings.players[0].name === 
                    this.ServiceManager.UserStorage.getData('nickname'),
                lobbyname: SessionSettings.lname,
                mode: SessionSettings.mode,
                field: SessionSettings.size,
                time: SessionSettings.time
            }
        };
        
        this.LobbyView.constructRoom(pageData);
    }

    actionOfflineLobby() {
        SessionSettings.ready = true;
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
        this.LobbyView.constructRoom(pageData).then(() => {
            this.LobbyView.setReady();
        })
    }

    showLobbies(data = null) {
        SessionSettings.lobbyId = -1;
        SessionSettings.ready = false;
        this.LobbyView.setNotReady();
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
            SessionSettings.players = [];
            SessionSettings.players[0] = owner;
            this.inLobby = true;
            this.lobbyId = data.id;
            this.ServiceManager.Router.go(`/lobby/room/${data.id}`);
        }
    }

    addLobbyInList(data = null) {
        this.LobbyView.addLobbyInList(data);
    }

    connectToLobby(data = null) {
        this.isOwner = false;
        let players = [];
        data.users.forEach(user => {
            players.push({
                avatar: defaultAvatar,
                name: user.additionalInfo,
                id: user.id
            });
        });

        players.push({
            avatar: defaultAvatar,
            name: this.ServiceManager.UserStorage.getData('nickname')
        });

        SessionSettings.mode = 'multiplayer';
        SessionSettings.time = data.gameTime;
        SessionSettings.size = data.fieldSize;
        SessionSettings.lname = data.name;
        SessionSettings.players = players;
        this.inLobby = true;
        this.lobbyId = data.id;
        this.ServiceManager.Router.go(`/lobby/room/${data.id}`);
    }

    changedState(data = null) {
        let newPlayer = null;
        const US = this.ServiceManager.UserStorage;
        let filtered = null;
        switch (data.action) {
        case 'CONNECTED':
            newPlayer = {
                avatar: defaultAvatar,
                name: data.nickname,
                id: data.userId
            };
            this.LobbyView.addPlayersToRoom([newPlayer], this.isOwner, this.lobbyId);
            SessionSettings.players.push(newPlayer);
            break;
        case 'DISCONNECTED':
            SessionSettings.ready = false;
            this.LobbyView.setNotReady();
            this.LobbyView.removePlayersFromRoom(data.nickname);
            filtered = SessionSettings.players.filter(p => p.name != data.nickname);
            SessionSettings.players = filtered;
            
            if (data.nickname === US.getData('nickname')) {
                this.inLobby = false;
                this.lobbyId = -1;
                SessionSettings.lobbyId = -1;
                this.ServiceManager.Router.re('/lobby');
            }
            break;
        case 'READY':
            SessionSettings.lobbyId = data.lobbyId;
            SessionSettings.ready = true;
            this.LobbyView.setReady();
            break;
        }
    }

    startGame(data = {}) {
        const players = data.players;
        players.forEach(player => {
            const name = player.additionalInfo;
            const id = player.id;
            const cur = SessionSettings.players.find(p => { return p.name === name; });
            cur.id = id;
        });
        //console.log(players)
        this.ServiceManager.Router.re('/play');
    }

    updateLobbyList(data = {}) {
        const lobbyId = data.id;
        const playersCounter = data.countPlayers;
        const owner = data.owner;
        this.LobbyView.updateLobby(lobbyId, playersCounter, owner);
        //console.log('????')
    }

    deleteLobby(data = {}) {
        const lobbyId = data.id;
        this.LobbyView.deleteLobby(lobbyId);
    }

    disconnect() {
        this.ServiceManager.Net.disconnect();
    }
    
}

export default LobbyController;