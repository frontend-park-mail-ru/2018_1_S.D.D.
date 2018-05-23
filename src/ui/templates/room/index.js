'use strict';

import template from './room.pug';
import './room.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);

        const startbtn = elem.querySelector('.start-btn');
        startbtn.addEventListener('click', () => {
            const SM = new ServiceManager();
            SM.Router.re('/play');
        });

        return elem;
    }
};
