'use strict';

import View from './View';
import ErrorTemplate from '../ui/templates/error/';

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
	}

	showPage() {
		this.show('Error');
	}
}

export default ErrorView;
