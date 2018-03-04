'use strict';
import Route from './route';

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

	/**
	 * Redirect to new page specified by urlPath
	 * 
	 * @param {string} urlPath Url path to page 
	 */
	go(urlPath) {
		if (urlPath === this.getCurrentUrlPath()) {
			return;
		}
		window.history.pushState({}, '', urlPath);
		this.loadPage(urlPath);
	}
    
	/**
	 * Checks path for valid and returns new path
	 *
	 * @param {string} urlPath Url path to page
	 * @return {string} New url path to page 
	 */
	getNewUrlPath(urlPath) {
		if (urlPath && urlPath != '/' && urlPath.slice(-1) == '/') {
			return urlPath.slice(0, -1);
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
	 * Loads page associated with url 
	 * 
	 * @param {string} urlPath Url path to page
	 */
	loadPage(urlPath) {
		let newUrlPath = this.getNewUrlPath(urlPath);
		let route = this.routes.find(routeIterator => {
			return routeIterator.urlPath == newUrlPath;
		});

		if (this.currentRoute != null) {
			this.currentRoute.destroy();
		}

		if (!route) {
			route = this.notFound();
		}
		
		this.currentRoute = route;
		newUrlPath = newUrlPath.split('/');

		if(!this.currentRoute.load(newUrlPath[2])) {
			route = this.notFound();
			this.currentRoute = route;
			this.currentRoute.load();
		}
	}
}

export default Router;