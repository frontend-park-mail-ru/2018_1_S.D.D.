'use strict';

import template from './form.pug';
import './form.scss';

export default {
	serialize: (html) => {
		const inputs = html.querySelectorAll('input');
		const inputsArray = Array.from(inputs);
		let serialized = {};
		inputsArray.forEach(input => {
			serialized[input.name] = input.value;
		});
		return serialized;
	},
	addError: (input, message, html = document) => {
		const inputElement = html.querySelector('[name="' + input + '"]');
		inputElement.classList.add('input-error');
		const inputMessage = html.querySelector('.error-' + input);
		inputMessage.classList.add('error-message-active');
		inputMessage.innerHTML = message;
	},
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
			input.addEventListener('click', () => {
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
