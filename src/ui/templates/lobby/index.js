'use strict';

import template from './lobby.pug';
import rowmixin from './row.pug';
import './lobby.scss';
import ServiceManager from '../../../modules/ServiceManager';

export default {
    subscribeOpen: function(tr) {
        tr.addEventListener('click', () => {
            const id = tr.getAttribute('data-id');
            const SM = new ServiceManager();
            const Net = SM.Net;
            const connectRequest = {
                'class': 'LobbyMessage',
                'action': 'CONNECT',
                'id': id
            };
            Net.send(connectRequest);
        });
    },

    updateLobby: function(id, players, owner) {
        const lobbies = document.querySelectorAll('tr.lobby-connect');
        lobbies.forEach(l => {
            //console.log(l, id, players, owner)
            if (l.dataset.id === `${id}`) {
                const updOwn = l.querySelector('.lobby-owner-upd');
                updOwn.innerHTML = owner;
                const updCount = l.querySelector('.lobby-count-upd');
                updCount.innerHTML = players + '/4';
            }
        });
    },

    deleteLobby: function(id) {
        const wr = document.querySelector('.lobbies__list');
        const lobbies = document.querySelectorAll('tr.lobby-connect');
        const lobbiesCount = lobbies.length;
        lobbies.forEach(l => {
            //console.log(l, id, players, owner)
            if (l.dataset.id === `${id}`) {
                l.remove();
                if (lobbiesCount === 1) {
                    const nodata = wr.querySelector('.table_nodata');
                    if (nodata) {
                        nodata.classList.remove('data-exists');
                    }
                }
            }
        });
    },

    addLobbyInList: function(lobby, table) {
        if (!table) return;
        const nodata = table.querySelector('.table_nodata');
        if (nodata) {
            nodata.classList.add('data-exists');
        }
        const tr = document.createElement('tr');
        tr.classList.add('table__tr', 'lobby-connect');
        tr.setAttribute('data-id', lobby.id);
        tr.innerHTML = rowmixin({r: lobby});
        this.subscribeOpen(tr);
        table.querySelector('tbody').appendChild(tr);
    },

    render: function(params) {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        elem.querySelectorAll('.lobby-connect').forEach(tr => {
            this.subscribeOpen(tr);
        });
        return elem;
    }
};
