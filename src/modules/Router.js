'use strict';
import Route from './route';

/** Class represents router in application. Allows  url routing. */
class Router {
    
    /**
     * Creates Router
     * 
     * @this {Router}
     */
    constructor() {
        this.routes = [];
    }

    /**
     * Adds route to Router
     * 
     * @param {string} urlPath - url path to page 
     * @param {object} controller - controller, which render page
     * @this {Router} 
     */
    addRoute(urlPath, controller) {
        const route = new Router(urlPath, controller);
        this.routes.push(route);
    }

    go() {

    }
    
    loadPage() {
        
    }
}

export default Router;