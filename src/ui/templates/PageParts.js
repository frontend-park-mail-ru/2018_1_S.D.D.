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
	 * Add html template to block on page.
	 * 
	 * @param {string} id Id of block in which we add template.
	 * @param {HTMLElement} element Html template which we add to block.
	 * @returns {boolean} False if block not found. True in other case.
	 */
	addToBlock(id, element) {
		if(!this.block(id)) {
			return false;
		}
		element.classList.add('template-disabled');
		this.block(id).root.appendChild(element);
		return true;
	}

	/**
	 * Change current visible template in block. And show block if it's hidden.
	 * 
	 * @param {string} templateName Name of template to show in block.
	 * @returns {boolean} False if template not found or template has not link to block. True in other case.
	 */
	changeTemplate(templateName) {
		const templateObject = this._TemplateHolder.template(templateName);
		if(!templateObject || !templateObject.block) {
			return false;
		}
		
		const id = templateObject.block;

		this.block(id).hideOnShow.forEach(block => {
			this.disableViewBlock(block);
		});

		const currentTemplate = this.block(id).currentTemplate;
		const T = this._TemplateHolder.template(currentTemplate);

		if(T && currentTemplate !== templateName) {
			T.html.classList.add('template-disabled');
			T.html.classList.remove('template-active');
			T.html.hidden = true;
		}

		this.block(id).currentTemplate = templateName;
		this.activateViewBlock(id);

		return true;
	}

	/**
	 * Add block to which we should hide when other block gonna be shown.
	 * 
	 * @param {strig} id Id of block which will hide.
	 * @param {string} blockToHide Id of block which will be hided.
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
			const loadedTemplates = this.block(id).root.childNodes;
			[].forEach.call(loadedTemplates, template => {
				template.hidden = true;
				template.classList.add('template-disabled');
				template.classList.remove('template-active');
			});
			this.block(id).root.hidden = true;
			this.block(id).active = false;
		}
	}

}

export default PageParts;
