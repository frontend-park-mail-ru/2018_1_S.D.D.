'use strict';

import template from './menu.pug';
import './menu.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	}
};
