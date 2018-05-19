'use strict';

import View from './View';
import LobbyTemplate from '../ui/templates/lobby/';
import CreateLobbyTemplate from '../ui/templates/createlobby/';
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
}

export default LobbyView;
