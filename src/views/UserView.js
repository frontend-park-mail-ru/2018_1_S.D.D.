'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';

/**
 * Creates instance of UserView
 * 
 * @class
 * @classdesc User view. Render, shows, hide page.
 */
class UserView extends View {
    /**
     * Creates instance of UserView
     */
    constructor() {
        super();
    }

    /**
     * Reloading header in DOM.
     * 
     * @param {Object} data Data for template rendering
     */
    reloadHeader(data = {}) {
        this._data = data;
        const doShowLogo = HeaderTemplate.logoVisibility(this.load('Header'));
        this.load('Header', HeaderTemplate, { reload: true, appendFirst: true });
        this.show('Header');
        if (doShowLogo) {
            HeaderTemplate.showLogo();
        }
    }

    /**
     * Reload header and delete forms after login.
     */
    constructLogin() {
        this.remove('SignupForm');
        this.remove('LoginForm');
    }
}

export default UserView;
