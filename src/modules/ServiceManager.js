'use strict';

/** Service manager object - container of major application objects */
class ServiceManager {
    /** 
     * Creates Service manager object (singleton)
     * 
     * @this {ServiceManager}
     */
    constructor() {
        if (ServiceManager._instance) {
            return ServiceManager._instance;
        }   
        ServiceManager._instance = this;
     
        this._user = new User();
        this._router = new Router();
        this._apiService = new Api();
    }
    
    /**
     * Returns Router object
     * 
     * @this {ServiceManger}
     */
    get router() {
        return this._router;
    }

    /**
     * Returns User object
     * 
     * @this {ServiceManger}
     */
    get user() {
        return this._user;
    }

    /**
     * Returns ApiService object
     * 
     * @this {ServiceManger}
     */
    get apiService() {
        return this._apiService;
    }
}

export default ServiceManager;
