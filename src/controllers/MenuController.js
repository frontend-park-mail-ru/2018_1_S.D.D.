'use strict';

import Controller from './Controller';
import MenuView from '../views/MenuView';

class MenuController extends Controller {
	/**
	 * Creates instance of MenuController
	 */
	constructor() {
		super();
		this._View = new MenuView();
	}
    
	actionIndex() {
		this._View.constructPage();
	}
}

export default MenuController;
