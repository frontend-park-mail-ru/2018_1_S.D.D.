'use strict';

/**
 *  Sends requests to server. 
 */ 
class Api {
	/**
	 * Creates Api instance
	 * 
	 * @param {string} serverAddress Server address.
	 */
	constructor(serverAddress) {
		this.serverAddress = serverAddress;
	}

	/**
	 * GET request
	 * 
	 * @param {string} path Path to api method.
	 * @param {Object} data Data to send to server.
	 * @returns {Promise} Promise with server response.
	 */
	GET(path, data = null) {
		return this._request('GET', path, data);
	}

	/**
	 * POST request
	 * 
	 * @param {string} path Path to api method.
	 * @param {Object} data Data to send to server.
	 * @param {string} contentType 'Content-Type' header.
	 * @returns {Promise} Promise with server response.
	 */
	POST(path, data = null, contentType = 'application/json') {
		return this._request('POST', path, data, contentType);
	}

	/**
	 * Request to server.
	 * 
	 * @param {string} httpMethod Http method type (GET/POST/etc)
	 * @param {string} path Path to api method.
	 * @param {Object} data Data to send to server.
	 * @returns {Promise} Promise with server response.
	 */
	_request(httpMethod, path, data = null, contentType = 'application/json') {
		const requestSettings = {
			method: httpMethod,
			headers: {
				'Content-Type': contentType
			},
			credentials: 'include', // send user cookies, auth (etc) for cross-origin calls.
			mode: 'cors' // allow cross-domain request
		};

		if(data) {
			requestSettings.body = JSON.stringify(data);
		}

		return fetch(`${this.serverAddress}/api/${path}`, requestSettings);
	}
	
}

export default Api;