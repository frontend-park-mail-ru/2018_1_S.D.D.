'use strict';
import Route from './Route';

/** 
 * Creates Router.
 * @class
 * @classdesc Provide routing in application.
*/
class Router {
    
    /**
	 * Creates Router
	 */
    constructor() {
        this.routes = [];
        this._confirm = false;
        window.addEventListener('popstate', () => {
            this.loadPage(location.pathname);
        }, false);
    }

    /**
	 * Adds route to Router
	 * 
	 * @param {string} urlPath Url path to page
	 * @param {object} Controller Controller, which render page
	 */
    addRoute(urlPath, Controller) {
        const route = new Route(urlPath, Controller);
        this.routes.push(route);
    }

    /** 
	 * Returns current page url path 
	 * 
	 * @return {string} Current path
	 */
    getCurrentUrlPath() {
        return window.location.pathname;
    }

    requestConfirm(message) {
        this._confirm = true;
        this._confirmMessage = message;
    }

    /**
	 * Redirect to new page specified by urlPath
	 * 
	 * @param {string} urlPath Url path to page 
	 */
    go(urlPath, pushState = true) {
        const go = () => {
            if (urlPath !== this.getCurrentUrlPath() && pushState) {
                window.history.pushState({}, '', urlPath);
            }
            this.loadPage(urlPath);
        };

        if (this._confirm) {
            const c = confirm(this._confirmMessage);
            if (c) {
                this._confirm = false;
                go();
            }
        } else {
            go();
        }
    }

    /**
	 * Redirect to new page specified by urlPath without saving previous page.
	 * 
	 * @param {string} urlPath Url path to page
	 */
    re(urlPath) {
        const go = () => {
            window.history.replaceState({}, '', urlPath);
            this.loadPage(urlPath);
        };

        if (this._confirm) {
            const c = confirm(this._confirmMessage);
            if (c) {
                this._confirm = false;
                go();
            }
        } else {
            go();
        }
    }
    
    /**
	 * Checks path for valid and returns new path
	 *
	 * @param {string} urlPath Url path to page
	 * @return {string} New url path to page 
	 */
    getNewUrlPath(urlPath) {
        if (urlPath) {
            if (urlPath != '/' && urlPath.slice(-1) == '/') {
                return urlPath.slice(0, -1);
            }
            return urlPath;
        }
        return this.getCurrentUrlPath();
    }

    /** 
	 * Returns route with 404 controller.
	 * 
	 * @returns {Route} Route with 404 controller.
	*/
    notFound() {
        return this.routes[0];
    }

    /**
	 * Get controller name from url.
	 * 
	 * @param {string} url Url path.
	 */
    getController(url) {
        return url.split('/')[1];
    }

    /**
	 * Get action name from url.
	 * 
	 * @param {string} url Url path.
	 */
    getAction(url) {
        let action = url.split('/')[2];
        if (!action) {
            action = 'index';
        }
        return action;
    }

    /**
	 * Get params from url.
	 * 
	 * @param {string} url Url path.
	 */
    getParams(url) {
        const params = url.split('/');
        params.splice(0, 3);
        return params;
    }

    /**
	 * Loads page associated with url 
	 * 
	 * @param {string} urlPath Url path to page
	 */
    loadPage(urlPath) {
        let newUrlPath = this.getNewUrlPath(urlPath);
        let route = this.routes.find(routeIterator => {
            return routeIterator.urlPath == this.getController(newUrlPath);
        });

        if (this.currentRoute != null) {
            this.currentRoute.destroy();
        }

        let action = null;
        if (!route) {
            route = this.notFound();
            action = '404';
        } else {
            action = this.getAction(newUrlPath);
        }
		
        this.currentRoute = route;

        const params = this.getParams(newUrlPath);

        if (!this.currentRoute.load(action, params)) {
            route = this.notFound();
            this.currentRoute = route;
            this.currentRoute.load('404');
        }
    }
}

export default Router;