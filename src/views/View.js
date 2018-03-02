'use strict';

import Dom from '../modules/Dom';
import TemplateHolder from '../ui/templates/TemplateHolder';

/**
 * Creates instance of View
 * 
 * @class
 * @classdesc Base view. Creates base html template.
 */
class View {
	/**
	 * Creates instance of View. Finds main parts of page.
	 */
	constructor() {
		this._Dom = new Dom();
		this._TemplateHolder = new TemplateHolder();

		this._body = this.Dom.getByTag(document, 'body')[0];
		this._main = this.Dom.get('.block .main');
		this._left = this.Dom.get('.block .left');
		this._right = this.Dom.get('.block .right');
	}

	/** 
	 * Display page.
	 */
	show() {

	}

	/**
	 * Hide page.
	 */
	hide() {
		
	}

	get Dom() {
		return this._Dom;
	}

	get main() {
		return this._main;
	}

	get left() {
		return this._left;
	}

	get right() {
		return this._right;
	}
}

export default View;
