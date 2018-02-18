'use strict';

/** Class representing functionality to store controller and url associated with it. */ 
class Route {
    /**
     * Creates Route instance
     * 
     * @param {string} urlPath - url path to page
     * @param {object} controller - controller, which renders page
     * @this {Route}
     */
    constructor(urlPath, controller) {
        this.urlPath = urlPath;
        this.controller = controller;
        this.instance = null;
    }

    /**
     * Creates instance to render current page
     * 
     * @this {Route}
     */

    load() {
        if (this.instance == null) {
            this.instance = new this.controller();
        }

        this.controller.renderPage();
    }


    /** 
     * Destroys instance
     * 
     * @this {Route}
     */
    destroy() {
        this.instance.destroyPage();
        this.instance = null;
    }
};

export default Route;