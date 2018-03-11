'use strict';

import template from './header.pug';
import './header.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	}
};
