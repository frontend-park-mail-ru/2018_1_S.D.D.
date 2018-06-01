'use strict';
import ProgressBar from '../modules/ProgressBar';
import ServiceManager from '../modules/ServiceManager';
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
        this.Bus = new ServiceManager().EventBus;
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
        if (navigator.onLine) {
            return this._request('GET', path, data);
        } else {
            const EventBus = new ServiceManager().EventBus;
            EventBus.emit('error:noresponse');
        }
    }

    /**
     * POST request
     * 
     * @param {string} path Path to api method.
     * @param {Object} data Data to send to server.
     * @param {string} json Is content type JSON format?
     * @returns {Promise} Promise with server response.
     */
    POST(path, data = null, json = true) {
        if (navigator.onLine) {
            return this._request('POST', path, data, json);
        } else {
            const EventBus = new ServiceManager().EventBus;
            EventBus.emit('error:noresponse');
         }
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

        if (json) {
            requestSettings.headers['Content-Type'] = 'application/json';
        }

        if (data) {
            if (json) {
                data = JSON.stringify(data);
            }
            requestSettings.body = data;
        }

        return fetch(`${this.serverAddress}/api/${path}`, requestSettings).then(
            response => {
                ProgressBar.step();
                return response.json();
            },
            () => {
                const EventBus = new ServiceManager().EventBus;
            	EventBus.emit('error:noresponse');
            }
        );
    }
    
}

export default Api;
