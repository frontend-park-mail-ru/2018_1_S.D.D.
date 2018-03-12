'use strict';

import Model from './Model';

/**
 * Creates instance of MenuModel
 * 
 * @class
 * @classdesc Menu model. Provide data for template rendering.
 */
class MenuModel extends Model {
	/**
	 * Creates instance of MenuModel
	 */
	constructor() {
		super();
	}
	
	/**
	 * Get menu links
	 * 
	 * @returns {Object} Object contains menu links.
	 */
	getMenuItems() {
		return {
			menuItems: [
				{ link:'/play', text:'PLAY' },
				{ link:'/scores/show', text:'SCORES' },
				{ link:'/rules', text:'RULES' },
				{ link:'/about', text:'ABOUT' }
			]
		};
	}
}

export default MenuModel;
