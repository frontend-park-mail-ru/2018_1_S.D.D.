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
		this.ScoresModel = new ScoresModel();
		this.ScoresView = new ScoresView();
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
	 * 
	 * @param {number} page Number of page to display (pagination)
	 */
	actionShow(page = 1) {
		if (page === '' || page < 1) {
			this.go('/error/404', false);
		} else {
			this.ScoresModel.getUserCount(
				usersCount => {
					this.ScoresModel.getUserScores(
						page,
						usersList => {
							const data = {
								'Scores': {
									data: usersList
								},
								'ScoresPagination': {
									usersCount: usersCount,
									limit: this.ScoresModel.limit,
									currentPage: page,
									onPaginate: p => {
										this.go(`/scores/show/${p}`);
									}
								},
								'Header': this.getHeaderData()
							};
							this.ScoresView.constructPage(data);
							this.ScoresView.showPage();
						},
						() => {
							this.go('/error/503', false);
						}
					);
				},
				() => {
					this.go('/error/503', false);
				}
			);
		}
	}
	
}

export default ScoresController;