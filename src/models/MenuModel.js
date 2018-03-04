'use strict';

/**
 * Creates instance of MenuModel
 * 
 * @class
 * @classdesc Menu model. Provide data for template rendering.
 */
class MenuModel {
	/**
	 * Creates instance of MenuModel
	 */
	constructor() {
	}
    
	getMenuItems() {
		return {
			menuItems: [
				{ link:'/play', text:'PLAY' },
				{ link:'/scores', text:'SCORES' },
				{ link:'/rules', text:'RULES' },
				{ link:'/about', text:'ABOUT' }
			]
		};
	}
}

export default MenuModel;
