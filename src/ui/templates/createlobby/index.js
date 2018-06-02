'use strict';

import template from './createlobby.pug';
import './createlobby.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        const choose = elem.querySelectorAll('.choose');
        choose.forEach(ch => {
            ch.addEventListener('click', () => {
                choose.forEach(c => {
                    c.classList.remove('choosen');
                });
                ch.classList.add('choosen');
            });
        });

        const createBtn = elem.querySelector('.btn_creategame');
        createBtn.addEventListener('click', () => {
            const SM = new ServiceManager();
            const Router = SM.Router;
            const Net = SM.Net;
            
            const choosen = elem.querySelector('.choosen').dataset.multiplayer;
            const time = elem.querySelector('input[name=timer]').value;
            const field = elem.querySelector('input[name=size]').value;
            if (choosen !== 'offline' && params.loggedIn) {
                const lobbyCreateRequest = {
                    'class': 'LobbyMessage',
                    'action': 'CREATE',
                    'settings': {
                        'gameTime': time,
                        'fieldSize': field,
                        'isMultiplayer': choosen,
                        'name': 'Awesome lobby'//'Lobby name stub [templates/create/index]'
                    }
                };
                Net.send(lobbyCreateRequest);
            } else {
                Router.re(`/lobby/offline?time=${time}&field=${field}`);
            }
        });

        return elem;
    }
};
