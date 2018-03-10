'use strict';

import template from './scores.pug';
import './scores.scss';

export default {

	serialize: html => {
		const inputs = html.querySelectorAll('input');
		const inputsArray = Array.from(inputs);
		let serialized = {};
		inputsArray.forEach(input => {
			serialized[input.name] = input.value;
		});
		return serialized;
	},

	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	}
};
