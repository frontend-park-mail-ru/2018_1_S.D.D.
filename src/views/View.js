'use strict';

import ServiceManager from '../modules/ServiceManager';
import TemplateHolder from '../ui/templates/TemplateHolder';
import PageParts from '../ui/templates/PageParts';
import '../ui/styles/main.scss';

/**
 * Creates instance of View
 * 
 * @class
 * @classdesc Base view. Creates base html template.
 */
class View {
	/**
	 * Creates instance of View. Creates main blocks on page.
	 */
	constructor() {
		this._ServiceManager = new ServiceManager();
		this._TemplateHolder = new TemplateHolder();
		this._body = document.querySelector('body');

		this._data = {};
		this._PageBlock = new PageParts();
		this._initPageBlocks();
	}

	/**
	 * Creates main blocks on page. In this blocks we can insert templates.
	 */
	_initPageBlocks() {
		this._PageBlock.addViewBlock(
			'main',
			document.querySelector('main'),
			['block'],
			['left', 'right']
		);
		this._PageBlock.addViewBlock(
			'left',
			document.querySelector('main'),
			['block', 'block-inline', 'block_w60p'],
			['main']
		);
		this._PageBlock.addViewBlock(
			'right',
			document.querySelector('main'),
			['block', 'block-inline', 'block_w40p'],
			['main']
		);
	}

	/**
	 * All links in block gonna use router instead of opening new page.
	 * 
	 * @param {HTMLElement} html Block in which we will listen links.
	 */
	listenLinks(html) {
		const links = html.querySelectorAll('a');
		[].forEach.call(links, link => {
			const appendInHistory = !(link.getAttribute('nohistory') === 'true');
			if (!link.getAttribute('target')) {
				link.addEventListener('click', event => {
					event.preventDefault();
					const route = link.getAttribute('href');
					this._ServiceManager.Router.go(route, appendInHistory);
				});
			}
		});
	}

	/**
	 * Searches for template, which was required in view and insert it in DOM.
	 * 
	 * @param {string} templateName Template name (key)
	 * @param {Object} templateObject Template object (Renderer)
	 * @param {Object} properties Some custom properties.
	 * @param properties.block View block in wich template will be placed.
	 * @param properties.reload Even if template already exists - we render it.
	 * @param properties.connected Array of templates names which won't be hide in block.
	 * @param properties.appendFirst Flag - insert before or after existing content.
	 * @returns {HTMLElement|boolean} Rendered html or false if not templateObject specified (and not found).
	 */
	load(templateName, templateObject = null, properties = {}) {
		let T = this._TemplateHolder.template(templateName);
		const renderData = this._data[templateName];

		if (!T || T.reload || properties.reload) {
			if (!templateObject) {
				return false;
			}
			const html = templateObject.render(renderData);
			properties.reload = false;
			this.listenLinks(html);

			// if(T) -> it's reload
			const doReload = T;

			let block = null;
			if (doReload) {
				this._TemplateHolder.update(templateName, html, properties);
				block = T.block;
			} else {
				this._TemplateHolder.save(templateName, html, properties);
				block = properties.block;
			}

			T = this._TemplateHolder.template(templateName);

			if (block && this._PageBlock.block(block)) {
				this._PageBlock.addToBlock(templateName, !doReload);
			} else {
				if (T.appendFirst) {
					this._body.insertBefore(html, this._body.firstChild);
				} else {
					this._body.appendChild(html);
				}
			}
		}
		return T.html;
	}

	/** 
	 * Display element.
	 * 
	 * @param {string} templateName Name of template to display.
	 */
	show(templateName) {
		const T = this._TemplateHolder.template(templateName);
		if (T && !this._PageBlock.changeTemplate(templateName)) {
			T.html.hidden = false;
		}
	}

	/**
	 * Hide element.
	 * 
	 * @param {string} templateName Name of template to hide.
	 */
	hide(templateName) {
		const T = this._TemplateHolder.template(templateName);
		if (T) {
			T.html.hidden = true;
		}
	}

	/**
	 * Remove template from holder and DOM.
	 * 
	 * @param {string} templateName Name of template to remove.
	 */
	remove(templateName) {
		this._PageBlock.disconnectViewBlock(templateName);
		this._TemplateHolder.delete(templateName);
	}

}

export default View;
