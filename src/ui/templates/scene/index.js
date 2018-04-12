'use strict';

import template from './scene.pug';
import './scene.scss';

export default {
	setSize: (template, parent) => {
		const canvas = template.querySelector('.scene');
		const resolutionX = 1900;
		const resolutionY = 859;

		const tw = parent.clientWidth / resolutionX;
		const th = parent.clientHeight / resolutionY;

		let t = tw > th ? th : tw;
		t = t > 1 ? 1 / t : t;
		canvas.height = resolutionY * t;
		canvas.width = (resolutionX - 20) * t;
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
