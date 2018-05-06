'use strict';

import template from './logo.pug';
import './logo.scss';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    }
};
