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
				{ link:'/index', text:'Home' },
				{ link:'/about', text:'About' },
				{ link:'/rules', text:'Rules' },
			],
			block: 'right'
		});
	}
    
	constructPage() {
		this.show('Menu');
	}

	destroyPage() {
        
	}
}

export default MenuView;
