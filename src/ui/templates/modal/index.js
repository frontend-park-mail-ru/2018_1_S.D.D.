'use strict';

import template from './modal.pug';
import './modal.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    render: () => {
        const elem = document.createElement('div');
        elem.innerHTML = template();
        elem.querySelectorAll('.close-modal').forEach(element => {
            element.addEventListener('click', () => {
                const Service = new ServiceManager();
                Service.Router.re(Service.Router.last);
            });
        });
        return elem;
    }
};
