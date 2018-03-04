'use strict';

import Dom from '../../modules/Dom';
import TemplateHolder from './TemplateHolder';

/**
 * Creates instance of PageParts
 * 
 * @class
 * @classdesc Contains base page parts. Defines it's hiding effects.
 */
class PageParts {
	/**
	 * Creates instance of PageParts.
	 */
	constructor() {
		if(PageParts._instance) {
			return PageParts._instance;
		}
		PageParts._instance = this;
		
		this._Dom = new Dom();
		this._TemplateHolder = new TemplateHolder();
		this._vb = {};
		this._initViewBlocks();
	}

	changeTemplate(id, newTemplateName) {
		this.block(id).show();
		const currentTemplate = this._vb[id].currentTemplate;

		if(currentTemplate && currentTemplate !== newTemplateName) {
			this._TemplateHolder.template(currentTemplate).html.hidden = true;
		}
		this._vb[id].currentTemplate = newTemplateName;
		this._TemplateHolder.template(newTemplateName).html.hidden = false;
	}

	_addViewBlock(id, root, showCallback, hideCallback) {
		this._vb[id] = {
			root: root,
			active: false,
			show: showCallback,
			hide: hideCallback,
			currentTemplate: null
		};
	}

	_setViewBlockActive(id, active = true) {
		if(this._vb[id].active !== active) {
			this._vb[id].active = active;
		}
	}

	_activateViewBlock(id) {
		this._Dom.removeClass(this.block(id).root, 'disabled');
		this._Dom.addClass(this.block(id).root, 'active');
		this._setViewBlockActive(id);
	}

	_disableViewBlock(id) {
		this._Dom.removeClass(this.block(id).root, 'active');
		this._Dom.addClass(this.block(id).root, 'disabled');
		this._setViewBlockActive(id, false);
		
		if(this._vb[id].currentTemplate) {
			this._TemplateHolder.template(this._vb[id].currentTemplate).html.hidden = true;
		}
	}

	_initViewBlocks() {
		this._addViewBlock(
			'main',
			this._Dom.get('#main'),
			() => {
				this.block('left').hide();
				this.block('right').hide();
				this._activateViewBlock('main');
			},
			() => {
				this._disableViewBlock('main');
			}
		);
		this._addViewBlock(
			'left',
			this._Dom.get('#left'),
			() => {
				this.block('main').hide();
				this._activateViewBlock('left');
			},
			() => {
				this._disableViewBlock('left');
			}
		);
		this._addViewBlock(
			'right',
			this._Dom.get('#right'),
			() => {
				this.block('main').hide();
				this._activateViewBlock('right');
			},
			() => {
				this._disableViewBlock('right');
			}
		);
	}

	block(id) {
		return this._vb[id];
	}
}

export default PageParts;
