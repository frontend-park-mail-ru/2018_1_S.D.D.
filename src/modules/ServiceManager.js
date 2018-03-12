/* global API_SERVER_ADDRESS */

'use strict';

import Router from './Router';
import Api from './Api';
import User from './User';

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
		this._User = new User();
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
