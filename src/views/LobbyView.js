'use strict';

import View from './View';
import LobbyTemplate from '../ui/templates/lobby/';
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

    showPage() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('Lobby');
    }
}

export default LobbyView;
