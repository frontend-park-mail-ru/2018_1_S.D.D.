'use strict';

import ServiceManager from '../modules/ServiceManager';
import Dom from '../modules/Dom';
import TemplateHolder from '../ui/templates/TemplateHolder';
import '../ui/styles/main.scss';

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
		this._ServiceManager = new ServiceManager();
		this._TemplateHolder = new TemplateHolder();

		this._body = this.Dom.getByTag(document, 'body')[0];
		this._data = {};
		this._initViewBlocks();
	}

	_initViewBlocks() {
		const Dom = this.Dom;
		this._vb = {
			'main': {
				'root': Dom.get('#main'),
				'active': false,
				'show': () => {
					this._vb.left.hide();
					this._vb.right.hide();
				},
				'hide': () => {}
			},
			'left': {
				'root': Dom.get('#left'),
				'active': false,
				'show': () => {
					this._vb.main.hide();
				},
				'hide': () => {}
			},
			'right': {
				'root': Dom.get('#right'),
				'active': false,
				'show': () => {
					this._vb.main.hide();
				},
				'hide': () => {}
			}
		};
	}

	listenLinks(html) {
		const links = this.Dom.get('a', html);
		[].forEach.call(links, link => {
			link.addEventListener('click', event => {
				event.preventDefault();
				const route = link.getAttribute('href');
				this._ServiceManager.Router.go(route);
			});
		});
	}

	/**
	 * Searches for template, which was required in view and insert in DOM.
	 * 
	 * @param {string} templateName Template name (key)
	 * @param {Object} templateObject Template object (Renderer)
	 * @param {Object} properties Some custom properties.
	 * @param properties.block View block in wich template will be placed.
	 * @param properties.reload Even if template already exists - we render it.
	 * @param properties.appendFirst Flag - insert before or after existing content.
	 */
	load(templateName, templateObject, properties = {}) {
		const T = this._TemplateHolder.template(templateName);
		const renderData = this._data[templateName];

		if(!T || T.reload || properties.reload) {
			const html = templateObject.render(renderData);
			properties.reload = false;
			this.listenLinks(html);

			// if(T) -> it's reload
			if(T) {
				this._TemplateHolder.upadte(templateName, html, properties);
			} else {
				this._TemplateHolder.save(templateName, html, properties);
			}

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
	 * 
	 * @param {string} templateName Name of template to display.
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
	 * 
	 * @param {string} templateName Name of template to hide.
	 */
	hide(templateName) {
		const T = this._TemplateHolder.load(templateName);
		if(T) {
			T.hidden = true;
			if(T.block) {
				this._vb[T.block].hide();
			}
		}
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
