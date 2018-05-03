'use strict';

import template from './scene.pug';
import './scene.scss';

export default {
	setSize: (template, parent) => {
		const canvas = template.querySelector('.scene');

		const w = parent.clientWidth;
		const h = parent.clientHeight;

		const t = w > h ? h : w;
		canvas.height = t;
		canvas.width = t;
	},

	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	},

	getScene: template => {
		return template.querySelector('.scene');
	}
};
