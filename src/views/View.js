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
				'content': null,
				'show': () => {
					this._vb.left.hide();
					this._vb.right.hide();
				},
				'hide': () => {}
			},
			'left': {
				'root': Dom.get('.block .left')[0],
				'content': null,
				'show': () => {
					this._vb.main.hide();
				},
				'hide': () => {}
			},
			'right': {
				'root': Dom.get('.block .right')[0],
				'content': null,
				'show': () => {
					this._vb.main.hide();
				},
				'hide': () => {}
			}
		};
	}

	/**
	 * Searches for template, which was required in view.
	 * 
	 * @param {string} templateName Template name (key)
	 * @param {Object} templateObject Template object (Renderer)
	 * @param {Object} properties Some custom properties.
	 */
	load(templateName, templateObject, properties = null) {
		const T = this._TemplateHolder[templateName];
		if(!T || T.reload || properties.reload) {
			const html = templateObject.render(properties);
			properties.reload = false;
			this._TemplateHolder.save(templateName, html);
		}
	}

	/** 
	 * Display element.
	 */
	show(templateName, block = null) {
		if (block) {
			if(this._vb[block].content !== templateName) {
				this._vb[block].hide();
				this._vb[block].content = templateName;
				this._vb[block].root.innerHTML = '';
				this.Dom.insertDom(
					this._vb[block].root,
					this._TemplateHolder.load(templateName)
				);
				this._vb[block].show();
			}
		} else {
			this.Dom.insertDom(
				this._body, 
				this._TemplateHolder.load(templateName)
			);
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
