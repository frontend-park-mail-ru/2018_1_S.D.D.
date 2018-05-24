'use strict';

import template from './room.pug';
import addnewmmbr from './member.pug';
import './room.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    addPlayersToRoom: function(tmpl, players, isowner) {
        const place = tmpl.querySelector('.room__members');
        players.forEach(player => {
            const nm = addnewmmbr({
                newMmbr: player,
                isowner: isowner
            });
            const nmdiv = document.createElement('div');
            nmdiv.classList.add('member');
            nmdiv.innerHTML = nm;
            place.appendChild(nmdiv);
        });
    },

    render: function(params) {
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
