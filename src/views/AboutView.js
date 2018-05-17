'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import AboutTemplate from '../ui/templates/about/';

/**
 * Creates instance of AboutView
 * 
 * @class
 * @classdesc About view. Render, shows, hide page.
 */
class AboutView extends View {
    /**
     * Creates instance of AboutView
     */
    constructor() {
        super();
    }
    
    constructPage(data = {}) {
        this._data = data;

        return this.onLoad([
            ['Header', HeaderTemplate, { appendFirst: true }],
            ['About', AboutTemplate, { block: 'left' }]
        ])
            .then(() => {
                this.showPage();
            });
    }

    showPage() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('About');
    }
}

export default AboutView;
