'use strict';

import template from './avatar.pug';
import './avatar.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);
		return elem;
	}
};
