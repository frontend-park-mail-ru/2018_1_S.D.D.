'use strict';

import template from './profile.pug';
import './profile.scss';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    }
};
