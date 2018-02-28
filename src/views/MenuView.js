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
		this.template = MenuTemplate.render({
			menuItems: [{link:'123',text:'456'}]
		}); // later in parts object
	}
    
	show() {
		
	}

	hide() {
        
	}
}

export default MenuView;
