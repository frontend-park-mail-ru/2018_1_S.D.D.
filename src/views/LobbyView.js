'use strict';

import View from './View';
import LobbyTemplate from '../ui/templates/lobby/';
import CreateLobbyTemplate from '../ui/templates/createlobby/';
import RoomTemplate from '../ui/templates/room/';
import HeaderTemplate from '../ui/templates/header/';

/**
 * Creates instance of LobbyView
 * 
 * @class
 * @classdesc Error view. Render, shows, hide page.
 */
class LobbyView extends View {
    /**
     * Creates instance of LobbyView
     */
    constructor() {
        super();
    }

    addLobbyInList(data = null) {
        LobbyTemplate.addLobbyInList(data, this.load('Lobby'));
    }
    
    constructPage(data = {}) {
        this._data = data;
        return this.onLoad([
            ['Header', HeaderTemplate, { appendFirst: true }],
            ['Lobby', LobbyTemplate, { block: 'main', reload: true }]
        ])
            .then(() => {
                this.showPage();
            });
    }

    constructCreation(data = {}) {
        this._data = data;
        return this.onLoad([
            ['Header', HeaderTemplate, { appendFirst: true }],
            ['CreateLobby', CreateLobbyTemplate, { block: 'modal', reload: true }]
        ])
            .then(() => {
                this.showCreation();
            });
    }

    constructRoom(data = {}) {
        this._data = data;
        return this.onLoad([
            ['Header', HeaderTemplate, { appendFirst: true }],
            ['Room', RoomTemplate, { block: 'modal', reload: true }]
        ])
            .then(() => {
                this.showRoom();
            });
    }

    addPlayersToRoom(players, isowner) {
        RoomTemplate.addPlayersToRoom(this.load('Room'), players, isowner);
    }

    showPage() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('Lobby');
    }

    showCreation() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('CreateLobby');
    }

    showRoom() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('Room');
    }
}

export default LobbyView;
