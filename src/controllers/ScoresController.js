'use strict';

import Controller from './Controller';
import ScoresModel from '../models/ScoresModel';
import ScoresView from '../views/ScoresView';

class ScoresController extends Controller {
	/**
	 * Creates instance of ScoresController
	 */
	constructor() {
		super();
		this._Model = new ScoresModel();
		this._View = new ScoresView();
		this.addActions();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('show', this.actionIndex);
	}

	/**
	 * Common action. Show scores table
	 */
	actionIndex(params = []) {
		let page = (params[0] >= 1) ? params[0] : this.go('/scores/show/1');
		
		this._Model.getUserScores(
			page,
			result => {
				const data = {
					'Scores': {
						data: result,
						onClickPrev: () => {
							page--;
							this.go(`/scores/show/${page}`);
						},
						onClickNext: () => {
							page++;
							this.go(`/scores/show/${page}`);
						}
					}
				};
				this._View.constructPage(data);
				this._View.showPage();
			},
			() => {
				
			}
		);
	}

	
}

export default ScoresController;