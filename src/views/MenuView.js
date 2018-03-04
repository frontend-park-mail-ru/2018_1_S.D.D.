'use strict';

import View from './View';
import LogoTemplate from '../ui/templates/logo/';
import MenuTemplate from '../ui/templates/menu/';

/**
 * Creates instance of MenuView
 * 
 * @class
 * @classdesc Menu view. Render, shows, hide page.
 */
class MenuView extends View {
	/**
	 * Creates instance of MenuView
	 */
	constructor() {
		super();
	}
    
	constructPage(data = {}) {
		this._data = data;
		this.load('Logo', LogoTemplate, { block: 'left' });
		this.load('Menu', MenuTemplate, { block: 'right' });
	}

	showPage() {
		this.show('Logo');
		this.show('Menu');
	}

	hidePage() {
		this.hide('Logo');
		this.hide('Menu');
	}
}

export default MenuView;
