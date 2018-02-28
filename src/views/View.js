'use strict';

/**
 * Creates instance of View
 * 
 * @class
 * @classdesc Base view. Provide work with DOM and creates base html template.
 */
class View {
	/**
     * Creates instance of View
     */
	constructor() {
		if(View._instance) {
			return View._instance;
		}
		View._instance = this;
		this.prepareTemplate();
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
	 */
	getByClass(element, className) {
		element.getElementsByClassName(className);
	}

	/**
	 * Search element by id
	 * 
	 * @param {HTMLElement} element Root element
	 * @param {string} id Id to find
	 */
	getById(element, id) {
		element.getElementById(id);
	}

	/**
	 * Search element by tag name
	 * 
	 * @param {HTMLElement} element Root element
	 * @param {string} tagName Tag name to find
	 */
	getByTag(element, tagName) {
		element.getElementsByTagName(tagName);
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
		selectorArray.forEach(selectorElement => {
			const elementType = selectorElement[0];
			const s = selectorElement.substring(1, selectorElement.length);
			if(!searchableElement) {
				switch(elementType) {
				case '#':
					searchableElement = this.getById(document, s);
					break;
				case '.':
					searchableElement = this.getByClass(document, s);
					break;
				default:
					searchableElement = this.getByTag(document, selectorElement);
					break;
				}
				if(!searchableElement) {
					return false;
				}
			} else {
				if(searchableElement.isArray()) {
					searchableElement = searchableElement.filter(element => {
						return this.hasSelector(element, selectorElement);
					});
				} else {
					if(!this.hasSelector(searchableElement, selectorElement)) {
						return false;
					}
				}
			}
		});
		return searchableElement;
	}

	/** 
	 * Creates common html structure.
	*/
	prepareTemplate() {
		document.getElementsByTagName('body')[0];
	}

	/** 
     * Display page.
    */
	show() {

	}
}

export default View;