/* global API_SERVER_ADDRESS */
/* global WS_ADDRESS */

'use strict';

import Router from './Router';
import Api from './Api';
import EventBus from './EventBus';
import UserStorage from './Storage';
import Net from './Net';

/** Service manager object - container of major application objects */
class ServiceManager {
    /** 
     * Creates Service manager object (singleton)
     */
    constructor() {
        if (ServiceManager._instance) {
            return ServiceManager._instance;
        }   
        ServiceManager._instance = this;
     
        this._Router = new Router();
        this._ApiService = new Api(API_SERVER_ADDRESS);
        this._EventBus = new EventBus();
        this._UserStorage = new UserStorage();
        this._Net = new Net(WS_ADDRESS);
    }
    
    /**
     * Returns Router object
     */
    get Router() {
        return this._Router;
    }

    /**
     * Returns EventBus object
     */
    get EventBus() {
        return this._EventBus;
    }

    /**
     * Returns User object
     */
    get UserStorage() {
        return this._UserStorage;
    }

    /**
     * Returns ApiService object
     */
    get ApiService() {
        return this._ApiService;
    }

    /**
     * Returns Net object.
     */
    get Net() {
        return this._Net;
    }
}

export default ServiceManager;
