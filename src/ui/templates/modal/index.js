'use strict';

import template from './modal.pug';
import './modal.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    render: (params = {}) => {
        params.mobile = false;
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            params.mobile = true;
        }
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        elem.querySelectorAll('.close-modal').forEach(element => {
            element.addEventListener('click', () => {
                const Service = new ServiceManager();
                Service.Router.re(Service.Router.last);
            });
        });
        elem.querySelectorAll('.close-modal-mobile').forEach(element => {
            element.addEventListener('click', () => {
                const Service = new ServiceManager();
                Service.Router.re(Service.Router.last);
            });
        });
        return elem;
    }
};
