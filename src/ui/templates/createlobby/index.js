'use strict';

import template from './createlobby.pug';
import './createlobby.scss';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    }
};
