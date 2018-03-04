'use strict';

import Controller from './Controller';
import MenuView from '../views/MenuView';
import MenuModel from '../models/MenuModel';

class MenuController extends Controller {
	/**
	 * Creates instance of MenuController
	 */
	constructor() {
		super();
		this._Menu = new MenuModel();
		this._View = new MenuView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
	}

	/**
	 * Default action. Renders menu.
	 */
	actionIndex() {
		const data = {
			'Menu': this._Menu.getMenuItems()
		};	
		this._View.constructPage(data);
		this._View.showPage();
	}
}

export default MenuController;
