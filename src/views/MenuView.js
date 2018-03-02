'use strict';

import View from './View';
import MenuTemplate from '../ui/templates/menu/menu';

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
		this._loadRequirements();
	}

	_loadRequirements() {
		this._menuTemplate = this.load('Menu', MenuTemplate, {
			menuItems: [
				{ link:'/play', text:'PLAY' },
				{ link:'/scores', text:'SCORES' },
				{ link:'/rules', text:'RULES' },
				{ link:'/about', text:'ABOUT' }
			],
			block: 'right'
		});
	}
    
	constructPage() {
		this.show('Menu');
	}

	destroyPage() {
		this.hide('Menu');
	}
}

export default MenuView;
