'use strict';

import Dom from '../../modules/Dom';
import TemplateHolder from './TemplateHolder';

/**
 * Creates instance of PageParts
 * 
 * @class
 * @classdesc Contains base page parts. Defines show/hide behaviour.
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
	}

	/**
	 * Get block object.
	 * 
	 * @param {string} id Id of block.
	 * @returns {Object} View block object.
	 */
	block(id) {
		return this._vb[id];
	}

	/**
	 * Creates new View Block on a page.
	 * 
	 * @param {string} id Id of element.
	 * @param {HTMLElement} root Element where we insert new block.
	 * @param {string[]} classes Element classes (for CSS or whatever).
	 * @param {string[]} hideOnShowList Id of blocks which dhould be hided when this block is visible.
	 */
	addViewBlock(id, root, classes = [], hideOnShowList = []) {
		if(!this._vb[id]) {
			const element = document.createElement('div');
			element.hidden = true;
			element.id = id;
			classes.forEach(c => {
				this._Dom.addClass(element, c);
			});
			this._Dom.insertDom(root, element);

			this._vb[id] = {};
			this._vb[id].root = element;
			this._vb[id].active = false;
			this._vb[id].hideOnShow = hideOnShowList;
			this._vb[id].currentTemplate = null;
		}
	}

	/**
	 * Change current visible template in block. And show block if it's hidden.
	 * 
	 * @param {string} id Id of block in which we change template.
	 * @param {string} newTemplateName Name of template to show in block.
	 */
	changeTemplate(id, newTemplateName) {
		this.block(id).hideOnShow.forEach(block => {
			this.disableViewBlock(block);
		});

		const currentTemplate = this.block(id).currentTemplate;

		let T = null;
		if(currentTemplate && currentTemplate !== newTemplateName) {
			T = this._TemplateHolder.template(currentTemplate).html;
			T.hidden = true;
		}
		this.block(id).currentTemplate = newTemplateName;

		T = this._TemplateHolder.template(newTemplateName).html;
		this._Dom.addClass(T, 'template-disabled');
		T.hidden = true;
		
		this.activateViewBlock(id);
	}

	/**
	 * 
	 * @param {*} id Id of block which will hide.
	 * @param {*} blockToHide Id of block which will be hided.
	 */
	_addBlockTohide(id, blockToHide) {
		this.block(id).hideOnShow.push(blockToHide);
	}

	/**
	 * Makes block and it's current template visible.
	 * 
	 * @param {string} id Id of block to activate.
	 */
	activateViewBlock(id) {
		if(!this.block(id).active) {
			this.block(id).root.hidden = false;
			const currentTemplate = this.block(id).currentTemplate;
			const T = this._TemplateHolder.load(currentTemplate);

			if(T) {
				T.hidden = false;
				setTimeout(() => {
					this._Dom.addClass(T, 'template-active');
					this._Dom.removeClass(T, 'template-disabled');
				}, 50);	
			}
			
			this.block(id).active = true;
		}
	}

	/**
	 * Hides the block.
	 * 
	 * @param {string} id Id of block to disable.
	 */
	disableViewBlock(id) {
		if(this.block(id).active) {
			const currentTemplate = this.block(id).currentTemplate;
			const T = this._TemplateHolder.load(currentTemplate);
			if(T) {
				T.hidden = true;
				this._Dom.removeClass(T, 'template-active');
				this._Dom.addClass(T, 'template-disabled');
			}
			this.block(id).root.hidden = true;
			this.block(id).active = false;
		}
	}

}

export default PageParts;
