'use strict'

import ServiceManager from './ServiceManager';

export default class Net {
    constructor(SocketAddr) {
        this.socketAddres = SocketAddr;
        this.socket = null;
        this.ready = false;
        this.disconnected = true;
        this.connect();
    }

    connect() {
        this.disconnected = false;
        this.socket = new WebSocket(this.socketAddres);
        this.socket.onmessage = this.messageHandler;
        this.socket.onopen = () => {
            this.ready = true;
        }
        this.socket.onclose = () => {
            this.ready = false;
            this.disconnected = true;
        }
    }

    send(msg) {
        if (this.disconnected) {
            this.connect(this.socketAddres);
        }
        if (!this.ready) {
            setTimeout(() => {
                this.send(msg);
            }, 200)
        } else {
            this.socket.send(JSON.stringify(msg));
        }
    }

    messageHandler(msg) {
        const data = JSON.parse(msg.data);
        const EventBus = new ServiceManager().EventBus;
        console.log(data)
        EventBus.emit(`WS:${data.class}`, data);
    }
}