'use strict';

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
     
        this._User = new User();
        this._Router = new Router();
        this._ApiService = new Api();
    }
    
    /**
     * Returns Router object
     */
    get Router() {
        return this._Router;
    }

    /**
     * Returns User object
     */
    get User() {
        return this._User;
    }

    /**
     * Returns ApiService object
     */
    get ApiService() {
        return this._ApiService;
    }
}

export default ServiceManager;
