'use strict';

/**
 * Creates instance of Dom
 * 
 * @class
 * @classdesc Provide work with DOM.
 */
class Dom {
	/**
	 * Creates instance of View
	 */
	constructor() {
		if(Dom._instance) {
			return Dom._instance;
		}
		Dom._instance = this;
	}

	/**
	 * Check if element has class.
	 * 
	 * @param {HTMLElement} element Element to check
	 * @param {string} className Class name to check
	 */
	hasClass(element, className) {
		return element.classList.contains(className);
	}

	/**
	 * Removes class from element
	 * 
	 * @param {HTMLElement} element Element with class
	 * @param {string} className Class to delete
	 */
	removeClass(element, className) {
		element.classList.remove(className);
	}

	/**
	 * Add class to element
	 * 
	 * @param {HTMLElement} element Element without class
	 * @param {string} className Class to add
	 */
	addClass(element, className) {
		element.classList.add(className);
	}

	/**
	 * Check if element has id.
	 * 
	 * @param {HTMLElement} element Element to check
	 * @param {string} id Id to check
	 */
	hasId(element, id) {
		return element.id === id;
	}

	/**
	 * Check if element is tag.
	 * 
	 * @param {HTMLElement} element Element to check
	 * @param {string} tagName Tag name to check
	 */
	isTag(element, tagName) {
		element.tagName === tagName;
	}

	/**
	 * Check if element has selector.
	 * 
	 * @param {HTMLElement} element Element to check
	 * @param {string} selector Class name to check
	 */
	hasSelector(element, selector) {
		const elementType = selector[0];
		const s = selector.substring(1, selector.length);
		switch(elementType) {
		case '#':
			return this.hasId(element, s);
		case '.':
			return this.hasClass(element, s);
		default:
			return this.isTag(element, selector);
		}
	}

	/**
	 * Search element by class name
	 * 
	 * @param {HTMLElement} element Root element
	 * @param {string} className Class name to find
	 * @returns {Array} Array of founded HTMLElements
	 */
	getByClass(element, className) {
		return element.getElementsByClassName(className);
	}

	/**
	 * Search element by id
	 * 
	 * @param {HTMLElement} element Root element
	 * @param {string} id Id to find
	 * @returns {HTMLElement} Founded HTMLElement
	 */
	getById(element, id) {
		return element.getElementById(id);
	}

	/**
	 * Search element by tag name
	 * 
	 * @param {HTMLElement} element Root element
	 * @param {string} tagName Tag name to find
	 * @returns {Array} Array of founded HTMLElements
	 */
	getByTag(element, tagName) {
		return element.getElementsByTagName(tagName);
	}

	/**
	 * Searching for element represented by selector.
	 * 
	 * @param {string} selector CSS selector like "tag #id .class"
	 * @returns {(HtmlElement|Array|Boolean)} HTMLElement or array that contains elements. False if element not found.
	 */
	get(selector) {
		let searchableElement = false;
		const selectorArray = selector.split(' ');
		selectorArray.some(selectorElement => {
			const elementType = selectorElement[0];
			const s = selectorElement.substring(1, selectorElement.length);
			if(!searchableElement) {
				switch(elementType) {
				case '#':
					searchableElement = this.getById(document, s);
					break;
				case '.':
					searchableElement = Array.from(this.getByClass(document, s));
					break;
				default:
					searchableElement = Array.from(this.getByTag(document, selectorElement));
					break;
				}
				if(!searchableElement || searchableElement.length === 0) {
					return true;
				}
			} else {
				if(Array.isArray(searchableElement)) {
					searchableElement = searchableElement.filter(element => {
						return this.hasSelector(element, selectorElement);
					});
				} else {
					if(!this.hasSelector(searchableElement, selectorElement)) {
						return true;
					}
				}
			}
		});
		return searchableElement;
	}

	/**
	 * Insert element in DOM
	 * 
	 * @param {HTMLElement} parent Root of inserted element
	 * @param {HTMLElement} element Element to insert in DOM
	 * @param {boolean} insertBefore Flag - insert before content
	 */
	insertDom(parent, element, insertBefore = false) {
		if(insertBefore) {
			parent.insertBefore(element, parent.firstChild);
		} else {
			parent.appendChild(element);
		}
	}
}

export default Dom;
