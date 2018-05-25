'use strict';

import template from './form.pug';
import './form.scss';

export default {
    /**
     * Gets data from form inputs.
     * 
     * @param {HTMLElement} html Html block with form.
     * @returns {Object} Serialized data from inputs.
     */
    serialize: function(html) {
        const inputs = html.querySelectorAll('input');
        const inputsArray = Array.from(inputs);
        let serialized = {};
        inputsArray.forEach(input => {
            serialized[input.name] = input.value;
        });
        return serialized;
    },

    /**
     * Gets data from multipart form.
     * 
     * @param {HTMLElement} html Html block with form.
     * @returns {Object} Serialized data from inputs.
     */
    serializeMultipart: function(html) {
        const form = html.querySelector('form');
        const data = new FormData(form);
        return data;
    },

    /**
     * Adds error mesage to input.
     * 
     * @param {string} input Name of input to add error.
     * @param {string} message Error message.
     * @param {HTMLElement} html Html block with form.
     * @returns {boolean} True id error added, false if input not found.
     */
    addError: function(input, message, html = document) {
        // If we adding error that means request completed
        // So we need to hide animation loader
        html.querySelector('.form__btn_submit__text').hidden = false;
        html.querySelector('.loader').hidden = true;

        // If it's input error - looking for input to color it
        if (input !== 'general') {
            const inputElement = html.querySelector(`[name="${input}"]`);
            if (!inputElement) {
                return false;
            }
            inputElement.classList.add('input-error');
        }

        // Show error message
        const inputMessage = html.querySelector(`.error-${input}`);
        inputMessage.classList.add('error-message-active');
        inputMessage.innerHTML = message;
        return true;
    },

    /**
     * Renders form and sets 'onsubmit' action.
     * 
     * @param {Object} params Data for render and submit action.
     * @returns {HTMLElement} Html block with form.
     */
    render: function(params) {
        function disableError(selector) {
            const activeError = elem.querySelector(selector);
            activeError.classList.remove('error-message-active');
            activeError.innerHTML = '';
        }

        // Render template
        const elem = document.createElement('div');
        elem.innerHTML = template(params);

        // Hide errors on field focus
        const inputs = elem.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.classList.remove('input-error');
                disableError(`.error-${input.name}`);
                disableError('.error-general');
            });
        });

        // Display file name in type file input
        const fileApi = (window.File && window.FileReader && window.FileList && window.Blob ) ? true : false;
        const fileHolders = elem.querySelectorAll('.file-upload');
        fileHolders.forEach(holder => {
            const input = holder.querySelector('[name="file"]');
            input.addEventListener('change', () => {
                let fileName = '';
                if (fileApi && input.files[0]) {
                    fileName = input.files[0].name;
                }
                else {
                    fileName = input.value.replace('C:\\fakepath\\', '');
                }

                if (!fileName.length ) {
                    return;
                }

                const pathContainer = holder.querySelector('.file-upload__path');
                pathContainer.innerHTML = fileName;
            });
        });

        // Submit form handler
        const form = elem.querySelector('form');
        form.addEventListener('submit', event => {
            event.preventDefault();

            // Hide general error
            disableError('.error-general');

            // Show loader animation and hide button text
            elem.querySelector('.form__btn_submit__text').hidden = true;
            elem.querySelector('.loader').hidden = false;

            // Validate fields
            let validated = true;
            params.formInputs.forEach(input => {
                const fields = input.validateFields;
                if (fields) {
                    const fieldsValues = [];
                    fields.forEach(field => {
                        fieldsValues.push(form.querySelector(`[name="${field}"]`).value);
                    });
                    const validationError = input.validateMethod(...fieldsValues);
                    if (validationError) {
                        validated = false;
                        this.addError(input.name, validationError, form);
                    }
                }
            });
            
            if (!validated) {
                return;
            }

            // Submit form
            if (params.onSubmit) {
                params.onSubmit();
            } else {
                form.submit();
            }
        });
        return elem;
    }
};
