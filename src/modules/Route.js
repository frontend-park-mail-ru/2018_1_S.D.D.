'use strict';

/** Class representing functionality to store controller and url associated with it. */ 
class Route {
    /**
     * Creates Route instance
     * 
     * @param {string} urlPath - url path to page
     * @param {object} controller - controller, which renders page
     */
    constructor(urlPath, controller) {
        this.urlPath = urlPath;
        this.controller = controller;
        this.instance = null;
    }

    /**
     * Creates instance to render current page
     * 
     * @param {string} action Action to be called in controller.
     * @param {string[]} params Parameters for action. 
     * @returns {boolean} False if action not found (404), true in other case.
     */
    load(action = 'index', params = []) {
        if (action === '') {
            action = 'index';
        }
        if (!this.instance) {
            this.instance = new this.controller();
        }

        if (this.instance.action(action.toLowerCase(), params)) {
            return true;
        }
        return false;
    }

    /** 
     * Destroys instance
     */
    destroy() {
        this.instance.onPageLeave();
        this.instance = null;
    }
}

export default Route;