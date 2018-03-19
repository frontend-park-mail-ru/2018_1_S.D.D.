'use strict';

import template from './pagination.pug';
import './pagination.scss';

export default {
	makeAktive: function(html) {
		html.classList.remove('pagination__btn_disabled');
		html.classList.add('pagination__btn_active');
	},

	makeDisabled: function(html) {
		html.classList.remove('pagination__btn_active');
		html.classList.add('pagination__btn_disabled');
	},

	checkToDisable: function(page, pagesCount, btnPrev, btnNext) {
		if(page == 1) {
			this.makeDisabled(btnPrev);
		} else {
			this.makeAktive(btnPrev);
		}

		if(page >= pagesCount) {
			this.makeDisabled(btnNext);
		} else {
			this.makeAktive(btnNext);
		}
	},

	render: function(params) {
		const elem = document.createElement('div');
		elem.innerHTML = template(params);

		const btnPrev = elem.querySelector('.prev');
		const btnNext = elem.querySelector('.next');

		let page = params.currentPage;
		const pct = params.usersCount / params.limit;
		let pagesCount = Math.floor(pct);
		if (pct % 1 > 0) {
			pagesCount++;
		}

		this.checkToDisable(page, pagesCount, btnPrev, btnNext);

		btnPrev.addEventListener('click', event => {
			event.preventDefault();
			if(page > 1) {
				page--;
				params.onPaginate(page);
			}
			this.checkToDisable(page, pagesCount, btnPrev, btnNext);
		});
		
		btnNext.addEventListener('click', event => {
			event.preventDefault();
			if (page < pagesCount) {
				page++;
				params.onPaginate(page);
			}
			this.checkToDisable(page, pagesCount, btnPrev, btnNext);
		});
		return elem;
	}
};
