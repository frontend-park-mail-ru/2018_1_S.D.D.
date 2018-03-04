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

	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('close', this.actionClose);
	}

	actionIndex() {
		const data = {
			'Menu': this._Menu.getMenuItems()
		};	
		this._View.constructPage(data);
		this._View.showPage();
	}

	actionClose() {
		this._View.hidePage();
	}
}

export default MenuController;
