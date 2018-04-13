'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import ScoresTemplate from '../ui/templates/scores/';
import PaginationTemplate from '../ui/templates/pagination/';

/**
 * Creates instance of LoginView
 * 
 * @class
 * @classdesc Login view. Render, shows, hide page.
 */
class ScoresView extends View {
	/**
	 * Creates instance of ScoresView
	 */
	constructor() {
		super();
		this.connected = ['Scores', 'ScoresPagination'];
	}

	/**
	 * Load all required templates.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructScores(data = {}) {
		this._data = data;

		return this.onLoad([
			['Header', HeaderTemplate, { appendFirst: true }],
			['Scores', ScoresTemplate, { block: 'main', reload: true, connected: this.connected }]
		])
			.then(() => {
				this.showScores();
			});
	}

	/**
	 * Load pagination template.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructPagination(data = {}) {
		this._data = data;

		return this.onLoad([
			['ScoresPagination', PaginationTemplate, { block: 'main', connected: this.connected }]
		])
			.then(() => {
				this.showPagination();
			});
	}

	/**
	 * Display required templates.
	 */
	showScores() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Scores');
	}

	/**
	 * Display pagination.
	 */
	showPagination() {
		this.show('ScoresPagination');
	}
}

export default ScoresView;
