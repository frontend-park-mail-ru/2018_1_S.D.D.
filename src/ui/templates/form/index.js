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
	serialize: html => {
		const inputs = html.querySelectorAll('input');
		const inputsArray = Array.from(inputs);
		let serialized = {};
		inputsArray.forEach(input => {
			serialized[input.name] = input.value;
		});
		return serialized;
	},

	/**
	 * Adds error mesage to input.
	 * 
	 * @param {string} input Name of input to add error.
	 * @param {string} message Error message.
	 * @param {HTMLElement} html Html block with form.
	 * @returns {boolean} True id error added, false if input not found.
	 */
	addError: (input, message, html = document) => {
		const inputElement = html.querySelector('[name="' + input + '"]');
		if(!inputElement) {
			return false;
		}
		inputElement.classList.add('input-error');
		const inputMessage = html.querySelector('.error-' + input);
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
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		const form = elem.querySelector('form');
		form.addEventListener('submit', event => {
			event.preventDefault();
			if(params.onSubmit) {
				params.onSubmit();
			} else {
				form.submit();
			}
		});
		const inputs = elem.querySelectorAll('input');
		inputs.forEach(input => {
			input.addEventListener('focus', () => {
				input.classList.remove('input-error');
				const messageSelector = '.error-' + input.name;
				const messageElement = elem.querySelector(messageSelector);
				messageElement.innerHTML = '';
				messageElement.classList.remove('error-message-active');
			});
		});
		return elem;
	}
};
