'use strict';

import View from '../views/View';

class Controller {
	/**
     * Creates instance of Controller
     * 
     * @param {object} ServiceManager - major application objects container
     */
	constructor(ServiceManager) {
		if(Controller._instance) {
			return Controller._instance;
		}
		Controller._instance = this;
		this._View = new View();
		this._SM = ServiceManager;
	}

	/** 
     * Default action.
    */
	actionIndex() {
		this._View.show();
	}
}

export default Controller;