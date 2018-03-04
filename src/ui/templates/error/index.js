'use strict';

import template from './error.pug';
import './error.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		elem.hidden = true;
		return elem;
	}
};
