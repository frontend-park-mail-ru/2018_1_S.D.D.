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
		this.addAction('show', this.actionShow);
	}

	/**
	 * Defalt action not exists. 404.
	 */
	actionIndex() {
		this.go('/error/404/', false);
	}

	/**
	 * Common action. Show scores table
	 */
	actionShow(params = []) {
		let page = params[0] ? params[0] : 1;
		if(page < 1) {
			this.go('/error/404', false);
		} else {
			this._Model.getUserScores(
				page,
				result => {
					const data = {
						'Scores': {
							data: result,
							onClickPrev: () => {
								if(page > 1) {
									page--;
									this.go(`/scores/show/${page}`);
								}
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
					this.go('/error/503', false);
				}
			);
		}
	}

	
}

export default ScoresController;