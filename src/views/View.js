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
		this._initViewBlocks();
	}

	_initViewBlocks() {
		const Dom = this.Dom;
		this._vb = {
			'main': {
				'root': Dom.get('.block .main')[0],
				'active': false,
				'show': () => {
					this._vb.left.hide();
					this._vb.right.hide();
				},
				'hide': () => {}
			},
			'left': {
				'root': Dom.get('.block .left')[0],
				'active': false,
				'show': () => {
					this._vb.main.hide();
				},
				'hide': () => {}
			},
			'right': {
				'root': Dom.get('.block .right')[0],
				'active': false,
				'show': () => {
					this._vb.main.hide();
				},
				'hide': () => {}
			}
		};
	}

	/**
	 * Searches for template, which was required in view and insert in DOM.
	 * 
	 * @param {string} templateName Template name (key)
	 * @param {Object} templateObject Template object (Renderer)
	 * @param {Object} properties Some custom properties.
	 */
	load(templateName, templateObject, properties = null) {
		const T = this._TemplateHolder.template(templateName);
		if(!T || T.reload || properties.reload) {
			const html = templateObject.render(properties);
			properties.reload = false;
			this._TemplateHolder.save(templateName, html);
			if(properties.block && this._vb[properties.block]) {
				this.Dom.insertDom(this._vb[properties.block].root, html);
			} else {
				let first = false;
				if(properties.appendFirst) {
					first = true;
				}
				this.Dom.insertDom(this._body, html, first);
			}
		}
	}

	/** 
	 * Display element.
	 */
	show(templateName) {
		const T = this._TemplateHolder.load(templateName);
		if(T) {
			T.hidden = false;
			if(T.block) {
				this._vb[T.block].show();
			}
		}
	}

	/**
	 * Hide element.
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
