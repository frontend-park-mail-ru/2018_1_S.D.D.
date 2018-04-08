'use strict';

import template from './scene.pug';
import './scene.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	},

	getScene: template => {
		return template.querySelector('.scene');
	}
};
