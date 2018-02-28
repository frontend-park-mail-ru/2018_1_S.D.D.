'use strict';

import template from './menu.pug';
import './menu.scss';

export default {
	render: params => {
		return template(params);
	}
};
