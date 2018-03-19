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
	}

	/**
	 * Load all required templates.
	 * 
	 * @param {Object} data Data for template rendering.
	 */
	constructPage(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });

		const connected = ['Scores', 'ScoresPagination'];
		this.load('Scores', ScoresTemplate, { block: 'main', reload: true, connected: connected });
		this.load('ScoresPagination', PaginationTemplate, { block: 'main', connected: connected });
	}

	/**
	 * Display reuired templates.
	 */
	showPage() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Scores');
		this.show('ScoresPagination');
	}
}

export default ScoresView;
