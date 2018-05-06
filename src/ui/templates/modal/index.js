'use strict';

import template from './modal.pug';
import './modal.scss';

export default {
    render: () => {
        const elem = document.createElement('div');
        elem.innerHTML = template();
        return elem;
    }
};
