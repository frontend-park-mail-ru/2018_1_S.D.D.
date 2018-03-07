'use strict';

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
	 * @param {string[]} hideOnShowList Id of blocks which should be hided when this block is visible.
	 */
	addViewBlock(id, root, classes = [], hideOnShowList = []) {
		if(!this.block(id)) {
			const element = document.createElement('div');
			element.hidden = true;
			element.id = id;
			classes.forEach(c => {
				element.classList.add(c);
			});
			root.appendChild(element);

			this._vb[id] = {
				root: element,
				active: false,
				hideOnShow: hideOnShowList,
				currentTemplate: null
			};
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

		let T = this._TemplateHolder.template(currentTemplate);
		if(T && currentTemplate !== newTemplateName) {
			T.html.hidden = true;
		}
		this.block(id).currentTemplate = newTemplateName;

		T = this._TemplateHolder.template(newTemplateName);
		T.html.classList.add('template-disabled');
		T.html.hidden = true;
		
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
			this.block(id).active = true;
		}
		const currentTemplate = this.block(id).currentTemplate;
		const T = this._TemplateHolder.load(currentTemplate);

		if(T) {
			T.hidden = false;
			// if there is some CSS transition on .template-activate block
			// we need to set timeout after disable visibility hidden
			// or it's transition wont work
			setTimeout(() => {
				T.classList.add('template-active');
				T.classList.remove('template-disabled');
			}, 50);	
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
				T.classList.add('template-disabled');
				T.classList.remove('template-active');
			}
			this.block(id).root.hidden = true;
			this.block(id).active = false;
		}
	}

}

export default PageParts;
