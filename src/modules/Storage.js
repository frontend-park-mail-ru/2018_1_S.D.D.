'use strict';

/**
 * Will replace after event-bus implementation would be added.
 */
class EventBus {};

/**
 * Creates instance of Storage
 * 
 * @class
 * @classdesc Local strorage interface.
 */
class Storage {
	/**
	 * Creates instance of Storage
	 */
	constructor() {
		if(Storage._instance) {
			return Storage._instance;
		}
		Storage._instance = this;

		this._storage = new EventBus();
		window.addEventListener('storage', e => {
			this._storage.emit(`Storage:${e.key}`, e);
		});
	}

	/**
	 * Subscribe on event when data in localstorage changed.
	 * 
	 * @param {string} key Data changed in storage. 
	 * @param {Function} callback Function to evaluate when data changed.
	 */
	onChange(key, callback) {
		this._storage.subscribe(`Storage:${key}`, callback);
	}

	/**
	 * Remove onChange listener on data.
	 * 
	 * @param {string} key Data changed in storage.
	 */
	removeChangeLisener(key) {
		this._storage.unSubscribe(key);
	}

	/**
	 * Get data from localStorage.
	 * 
	 * @param {string} key Data in storage
	 */
	getData(key) {
		return localStorage.getItem(key);
	}

	/**
	 * Insert (update) data in localStorage.
	 * 
	 * @param {string} key Data name in localStorage.
	 * @param {*} value Data value in localStorage.
	 */
	setData(key, value) {
		localStorage.setItem(key, value);
	}

	/**
	 * Remove data from localStorage.
	 * 
	 * @param {string} key Data name in localStorage.
	 */
	removeData(key) {
		localStorage.removeItem(key);
	}

	/**
	 * Clear localStorage.
	 */
	clear() {
		localStorage.clear();
	}



}

export default Storage;
