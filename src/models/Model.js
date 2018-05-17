'use strict';

import ServiceManager from '../modules/ServiceManager';

/**
 * Creates instance of Model
 * 
 * @class
 * @classdesc Base model. Provide acces to ServiceManager.
 */
class Model {
    /**
     * Creates instance of Model
     */
    constructor() {
        this.ServiceManager = new ServiceManager();
    }
    
}

export default Model;
