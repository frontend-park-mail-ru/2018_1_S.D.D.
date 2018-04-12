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
	 * @returns {Promise} Promise.
	 */
	emit(key, args = []) {
		if (!Array.isArray(args)) {
			args = [args];
		}
		
		const events = this._eventsList[key];
		if (events && events.length > 0) {
			if (events.length === 1) {
				return Promise.resolve(events[0].callback.bind(events[0].context, ...args)());
			}
			return events.reduce((prevEvent, curEvent) => {
				return prevEvent.then(() => {
					return Promise.resolve(curEvent.callback.bind(curEvent.context, ...args)());
				});
			}, Promise.resolve(events[0].callback.bind(events[0].context, ...args)()));
		} else
		return Promise.resolve();
	}

	/**
	 * Subscribe function on event emitting.
	 * 
	 * @param {string} key Event name.
	 * @param {Function} callback Function to be executed on event emit.
	 * @param {Object} context Function context.
	 * @param {boolean} doSubscribeFirst Adding event in begin of queue or in end.
	 * @returns {Function} Function to unsubscribe event.
	 */
	subscribe(key, callback = () => null, context = this, doSubscribeFirst = false) {
		if (!this.eventExists(key)) {
			this._eventsList[key] = [];
		}

		if (!doSubscribeFirst || this._eventsList[key].length === 0) {
			this._eventsList[key].push({
				callback: callback,
				context: context,
			});
		} else {
			this._eventsList[key].unshift({
				callback: callback,
				context: context,
			});
		}
		return () => {
			this.unSubscribe(key, callback, context);
		};
	}

	/**
	 * Remove function from subscribtion.
	 * 
	 * @param {string} key Event name.
	 * @param {Function} callback Function to remove from subscribtion.
	 * @param {Object} context Context of function to remove from subscribtion.
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
