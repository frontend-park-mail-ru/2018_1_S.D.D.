'use strict';

/**
 * Creates instance of TemplateHolder
 * 
 * @class
 * @classdesc Contains loaded templates.
 */
class TemplateHolder {
	/** 
     * Creates instance of TemplateHolder.
     */
	constructor() {
		if(TemplateHolder._instance) {
			return TemplateHolder._instance;
		}
		TemplateHolder._instance = this;
        
		this._parts = {};
	}

	/**
     * Saves new template in holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @param {HTMLElement} templateHTML Template HTML code.
     * @param {Object} properties Asociated array with properties.
     * @returns {boolean} Operation success.
     */
	save(templateName, templateHTML, properties = {}) {
		if(!this._parts[templateName]) {
			this._parts[templateName] = {
				'html': templateHTML, properties
			};
		}
		return false;
	}

	/**
     * Update template properties in holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @param {Object} properties Asociated array with properties.
     */
	update(templateName, properties = {}) {
		if(!this._parts[templateName]) {
			return false;
		}
		for(let [key, property] of properties) {
			this._parts[templateName][key] = property;
		}
	}

	/**
     * Load template from holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @returns {boolean|HTMLElement} False if template not found, HTML code in other case.
     */
	load(templateName) {
		if(!this._parts[templateName]) {
			return false;
		}
		return this._parts[templateName].html;
	}
}

export default TemplateHolder;
