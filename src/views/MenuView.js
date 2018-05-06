'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import LogoTemplate from '../ui/templates/logo/';
import MenuTemplate from '../ui/templates/menu/';

/**
 * Creates instance of MenuView
 * 
 * @class
 * @classdesc Menu view. Render, shows, hide page.
 */
class MenuView extends View {
    /**
	 * Creates instance of MenuView
	 */
    constructor() {
        super();
    }
    
    constructPage(data = {}) {
        this._data = data;

        return this.onLoad([
            ['Header', HeaderTemplate, { appendFirst: true }],
            ['Logo', LogoTemplate, { block: 'left' }],
            ['Menu', MenuTemplate, { block: 'right' }]
        ])
            .then(() => {
                this.showPage();
            });
    }

    showPage() {
        this.show('Header');
        HeaderTemplate.hideLogo();
        this.show('Logo');
        this.show('Menu');
    }
}

export default MenuView;
