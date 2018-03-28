'use strict';

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

		this._storage = [];

		window.addEventListener('storage', e => {
			if(this._storage[e.key]) {
				this._storage[e.key].forEach(callback => {
					callback(this.grab(e.key), e);
				});
			}
		});
	}

	grab(key) {
		return localStorage.getItem(key);
	}



}

export default Storage;
