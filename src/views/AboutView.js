'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import AboutTemplate from '../ui/templates/about/';

/**
 * Creates instance of AboutView
 * 
 * @class
 * @classdesc About view. Render, shows, hide page.
 */
class AboutView extends View {
	/**
	 * Creates instance of AboutView
	 */
	constructor() {
		super();
	}
    
	constructPage(data = {}) {
		setTimeout(() => {
			this._data = data;
			this.load('Header', HeaderTemplate, { appendFirst: true });
			this.load('About', AboutTemplate, { block: 'left' });
		}, 2000);
	}

	showPage() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('About');
	}
}

export default AboutView;
