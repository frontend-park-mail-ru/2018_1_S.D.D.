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
	 * Checks if operation was success or not.
	 * 
	 * @param {Object} response Data recived from server.
	 * @returns {boolean} True if success, false in other case.
	 */
	responseSuccess(response) {
		const errorsList = response.errors;
		if (errorsList) {
			for (let error in errorsList) {
				if (errorsList.hasOwnProperty(error)) {
					return false;
				}
			}
		}
		return true;
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
	 * @param {boolean} json Flag if body is json.
	 * @returns {Promise} Promise with server response.
	 */
	_request(httpMethod, path, data = null, json = true) {
		const requestSettings = {
			method: httpMethod,
			headers: {
				'Accept-Language': 'en-US'
			},
			credentials: 'include', // send user cookies, auth (etc) for cross-origin calls.
			mode: 'cors' // allow cross-domain request
		};

		if(json) {
			requestSettings.headers['Content-Type'] = 'application/json';
		}

		if(data) {
			if(json) {
				data = JSON.stringify(data);
			}
			requestSettings.body = data;
		}

		return fetch(`${this.serverAddress}/api/${path}`, requestSettings).then(
			response => {
				return response.json();
			},
			() => {
				throw new Error('Connection issues. Try again later!');
			}
		);
	}
	
}

export default Api;