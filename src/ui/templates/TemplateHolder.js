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
        if (TemplateHolder._instance) {
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
        if (!this._parts[templateName]) {
            this._parts[templateName] = {
                'html': templateHTML, 
                'reload': false,
            };

            for (let propertyName in properties) {
                this._parts[templateName][propertyName] = properties[propertyName];
            }
            
            return true;
        }
        return false;
    }

    /**
     * Update template properties in holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @param {HTMLElement} templateHTML Rendered template.
     * @param {Object} properties Asociated array with properties.
     * @returns {boolean} Flse if template not found, true if ok.
     */
    update(templateName, templateHTML, properties = {}) {
        if (!this._parts[templateName]) {
            return false;
        }
        
        if (templateHTML) {
            const parent = this._parts[templateName].html.parentNode;
            const newTemplate = parent.insertBefore(templateHTML, this._parts[templateName].html);
            this._parts[templateName].html.remove();
            this._parts[templateName].html = newTemplate;
        }

        for (let propertyName in properties) {
            this._parts[templateName][propertyName] = properties[propertyName];
        }

        return true;
    }

    /**
     * Load template from holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @returns {boolean|HTMLElement} False if template not found, HTML code in other case.
     */
    load(templateName) {
        if (!this._parts[templateName]) {
            return false;
        }
        return this._parts[templateName].html;
    }

    /**
     * Delete template from holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @returns {boolean} False if template not found, true in deleted successful.
     */
    delete(templateName) {
        if (!this._parts[templateName]) {
            return false;
        }
        this._parts[templateName].html.remove();
        delete this._parts[templateName];
    }

    /**
     * Get template from holder.
     * 
     * @param {string} templateName Template ID in holder.
     * @returns {boolean|Object} False if template not found, template object other case.
     */
    template(templateName) {
        if (!this._parts[templateName]) {
            return false;
        }
        return this._parts[templateName];
    }
}

export default TemplateHolder;
