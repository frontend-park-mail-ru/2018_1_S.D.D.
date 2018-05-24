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

    addLobbyInList: function(lobby, table) {
        const nodata = table.querySelector('.table_nodata');
        if (nodata) {
            nodata.style.display = 'none';
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
