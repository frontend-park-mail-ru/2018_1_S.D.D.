'use strict';

import template from './lobby.pug';
import './lobby.scss';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    }
};
