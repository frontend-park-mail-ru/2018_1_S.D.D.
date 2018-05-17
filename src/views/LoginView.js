'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import LogoTemplate from '../ui/templates/logo/';
import FormTemplate from '../ui/templates/form/';

/**
 * Creates instance of LoginView
 * 
 * @class
 * @classdesc Login view. Render, shows, hide page.
 */
class LoginView extends View {
    /**
     * Creates instance of LoginView
     */
    constructor() {
        super();
    }

    /**
     * Serealize login form.
     * 
     * @returns {Object|boolean} Get form data {name: value} or false if form not found.
     */
    serializeForm() {
        const form = this.load('LoginForm');
        if (!form) {
            return false;
        }
        return FormTemplate.serialize(form);
    }

    /**
     * Add error message to input in form.
     * 
     * @param {string} input Input name.
     * @param {string} message Error message.
     * @returns {boolean} True if ok, false if form or input not found.
     */
    addFormError(input, message) {
        const form = this.load('LoginForm');
        if (!form) {
            return false;
        }
        return FormTemplate.addError(input, message, form);
    }
    
    /**
     * Load all required templates.
     * 
     * @param {Object} data Data for template rendering.
     */
    constructPage(data = {}) {
        this._data = data;

        return this.onLoad([
            ['Header', HeaderTemplate, { appendFirst: true }],
            ['Logo', LogoTemplate, { block: 'left' }],
            ['LoginForm', FormTemplate, { block: 'right' }]
        ])
            .then(() => {
                this.showPage();
            });
    }

    /**
     * Display reuired templates.
     */
    showPage() {
        this.show('Header');
        HeaderTemplate.hideLogo();
        this.show('Logo');
        this.show('LoginForm');
    }
}

export default LoginView;
