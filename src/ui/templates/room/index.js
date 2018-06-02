'use strict';

import template from './room.pug';
import addnewmmbr from './member.pug';
import './room.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    addPlayersToRoom: function(tmpl, players, isowner, lobbyId) {
        const place = tmpl.querySelector('.room__members');
        players.forEach(player => {
            const nm = addnewmmbr({
                newMmbr: player,
                isowner: isowner
            });
            const nmdiv = document.createElement('div');
            nmdiv.classList.add('member');
            nmdiv.classList.add(`member-${player.name}`);
            nmdiv.innerHTML = nm;
            const rembtn = nmdiv.querySelector('.member__remove');
            if (rembtn) {
                rembtn.addEventListener('click', () => {
                    const SM = new ServiceManager();
                    console.log(player, {
                        "class": "LobbyMessage",
                        "action": "DISCONNECT",
                        "id": lobbyId,
                        "userId": player.id
                    })
                    SM.Net.send({
                        "class": "LobbyMessage",
                        "action": "DISCONNECT",
                        "id": lobbyId,
                        "userId": player.id
                    });
                });
            }
            place.appendChild(nmdiv);
        });
    },

    removePlayersFromRoom: function(tmpl, player) {
        const place = tmpl.querySelector('.room__members');
        //console.log(place.querySelector(`.member-${player.name}`), `.member-${player}`)
        const rem = place.querySelector(`.member-${player}`);
        if (!rem) {
            return;
        }
        rem.remove();
    },

    render: function(params) {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);

        const startbtn = elem.querySelector('.start-btn');
        if (startbtn) {
            startbtn.addEventListener('click', () => {
                const SM = new ServiceManager();
                SM.Router.re('/play');
            });
        }

        return elem;
    }
};
