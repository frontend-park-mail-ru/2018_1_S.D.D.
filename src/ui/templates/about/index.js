'use strict';

import template from './about.pug';
import './about.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	}
};
