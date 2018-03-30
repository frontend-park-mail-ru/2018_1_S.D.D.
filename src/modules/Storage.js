'use strict';

import EventBus from './EventBus';

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
		if (Storage._instance) {
			return Storage._instance;
		}
		Storage._instance = this;

		this._storage = new EventBus();
		window.addEventListener('storage', e => {
			this._storage.emit(e.key, [e]);
		});
	}

	/**
	 * Subscribe on event when data in localstorage changed.
	 * 
	 * @param {string} key Data changed in storage. 
	 * @param {Function} callback Function to evaluate when data changed.
	 * @returns {string} Function id in subscribtion list.
	 */
	onChange(key, callback, context = this) {
		return this._storage.subscribe(key, callback, context);
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
	 * @returns {string|null} Value if found or null.
	 */
	getData(key) {
		return localStorage.getItem(key);
	}

	/**
	 * Get boolean data from localStorage.
	 * 
	 * @param {string} key Data in storage
	 * @returns {boolean|null} Boolean value if found or null.
	 */
	getBooleanData(key) {
		const value = localStorage.getItem(key);
		if (value) {
			return value === 'true';
		}
		return null;
	}

	/**
	 * Insert (update) data in localStorage.
	 * 
	 * @param {string} key Data name in localStorage.
	 * @param {string} value Data value in localStorage.
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
