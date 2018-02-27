'use strict';
import Route from './route';

/** Class represents router in application. Allows  url routing. */
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
     * @param {string} urlPath - url path to page
     * @param {object} Controller - controller, which render page
     */
	addRoute(urlPath, Controller) {
		const route = new Route(urlPath, Controller);
		this.routes.push(route);
	}

	/** 
     * Returns current page url path 
     * 
     * @return {string} - current path
    */
	getCurrentUrlPath() {
		window.location.pathname;
	}

	/**
     * Redirect to new page specified by urlPath
     * 
     * @param {string} urlPath - url path to page 
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
     * @param {string} urlPath - url path to page
     * @return {string} - new url path to page 
     */
	getNewUrlPath(urlPath) {
		if (urlPath && urlPath != '/' && urlPath.slice(-1) == '/') {
			return urlPath.slice(0, -1);
		}

		return this.getCurrentUrlPath();
	}

	/**
     * Loads page associated with url 
     * 
     * @param {string} urlPath - url path to page
     */
	changePage(urlPath) {
		const newUrlPath = this.getNewUrlPath(urlPath);
		let route = this.routes.find(routeIterator => {
			return routeIterator.urlPath == newUrlPath;
		});

		if (this.currentRoute != null) {
			this.currentRoute.destroy();
		}

		if (!route) {
			route = this.routes[0];
		}

		this.currentRoute = route;
		this.currentRoute.load();
	}
}

export default Router;