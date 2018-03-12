'use strict';

import template from './scores.pug';
import './scores.scss';

export default {
	render: params => {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);

		const btnPrev = elem.querySelector('.prev');
		btnPrev.addEventListener('click', event => {
			event.preventDefault();
			if(params.onClickPrev) {
				params.onClickPrev();
			}
		});
		const btnNext = elem.querySelector('.next');
		btnNext.addEventListener('click', event => {
			event.preventDefault();
			if(params.onClickNext) {
				params.onClickNext();
			}
		});
		return elem;
	}
};
