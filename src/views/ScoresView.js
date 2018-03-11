'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import LogoTemplate from '../ui/templates/logo/';
import ScoresTemplate from '../ui/templates/scores/';

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
		this.load('Logo', LogoTemplate, { block: 'left' });
		this.load('Scores', ScoresTemplate, { block: 'right' });
	}

	/**
	 * Display reuired templates.
	 */
	showPage() {
		this.show('Header');
		this.show('Logo');
		this.show('Scores');
	}
}

export default ScoresView;