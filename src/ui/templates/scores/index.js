'use strict';

import template from './scores.pug';
import './scores.scss';
import '../../styles/tables.scss';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    }
};
