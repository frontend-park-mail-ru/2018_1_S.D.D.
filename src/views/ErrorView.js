'use strict';

import View from './View';
import ErrorTemplate from '../ui/templates/error/';
import HeaderTemplate from '../ui/templates/header/';

/**
 * Creates instance of ErrorView
 * 
 * @class
 * @classdesc Error view. Render, shows, hide page.
 */
class ErrorView extends View {
	/**
	 * Creates instance of ErrorView
	 */
	constructor() {
		super();
	}
    
	constructPage(data = {}) {
		this._data = data;
		this.load('Error', ErrorTemplate, { block: 'main', reload: true });
		this.load('Header', HeaderTemplate, { appendFirst: true });
	}

	/**
	 * This method gonna be called only when user isn't authorized. So we reload header.
	 * 
	 * @param {Object} data Data for templates rendering
	 */
	construct403(data = {}) {
		this._data = data;
		this.load('Error', ErrorTemplate, { block: 'main', reload: true });
		this.load('Header', HeaderTemplate, { appendFirst: true, reload: true });
	}

	showPage() {
		this.show('Header');
		this.show('Error');
	}
}

export default ErrorView;
