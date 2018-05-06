'use strict';

import template from './header.pug';
import './header.scss';

export default {
    logoVisibility: (template = document) => {
        if (!template) {
            return false;
        }
		
        const header = template.querySelector('.header__logo');
        if (header) {
            return !header.hidden;
        }
        return false;
    },

    hideLogo: (time = 500, template = document) => {
        const header = template.querySelector('.header__logo');
        header.classList.add('header__logo_hided');
        setTimeout(() => {
            header.hidden = true;
        }, time);
    },

    showLogo: (template = document) => {
        const header = template.querySelector('.header__logo');
        header.hidden = false;
        setTimeout(() => {
            header.classList.remove('header__logo_hided');
        }, 50);
    },

    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    }
};
