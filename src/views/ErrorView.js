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

	showPage() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Error');
	}
}

export default ErrorView;
