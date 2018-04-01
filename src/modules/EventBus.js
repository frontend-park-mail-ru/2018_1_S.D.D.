'use strict';

/**
 * Creates instance of EventBus
 * 
 * @class
 * @classdesc Message delivering system.
 */
class EventBus {
	/**
	 * Creates instance of EventBus
	 */
	constructor() {
		this._eventsList = {};
	}

	/**
	 * Execute all callbacks to given event. 
	 * 
	 * @param {string} key Event name.
	 * @param {array} args Arguments to callbacks.
	 */
	emit(key, args = []) {
		if (!Array.isArray(args)) {
			args = [args];
		}
		
		const events = this._eventsList[key];
		if (events) {
			events.forEach(e => {
				e.callback.bind(e.context, ...args)();
			});
		}
	}

	/**
	 * Subscribe function on event emitting.
	 * 
	 * @param {string} key Event name.
	 * @param {Function} callback Function to be executed on event emit.
	 * @param {Object} context Function context.
	 */
	subscribe(key, callback, context = this) {
		if (!this.eventExists(key)) {
			this._eventsList[key] = [];
		}
		// avoid duplicate callbacks
		const prev = this._eventsList[key].find(event => {
			return (event.callback.toString() === callback.toString());
		});
		if (!prev) {
			this._eventsList[key].push({
				callback: callback,
				context: context,
			});
		}
	}

	/**
	 * Remove function from subscribtion.
	 * 
	 * @param {string} key Event name.
	 * @param {string} callbackId Id of function to remove from subscribtion.
	 */
	unSubscribe(key, callback, context) {
		if (this.eventExists(key)) {
			this._eventsList[key] = this._eventsList[key].filter(event => {
				event.callback != callback || event.context != context;
			});
		}
	}

	/**
	 * Check if event already exists in list.
	 * 
	 * @param {string} key Key of event to check.
	 */
	eventExists(key) {
		return this._eventsList[key] ? true : false;
	}
}

export default EventBus;
