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
			const EventBus = this.ServiceManager.EventBus;
			EventBus.subscribe('showScoresTable', usersList => {
				const data = {
					'Scores': {
						data: usersList
					},
					'Header': this.getHeaderData()
				};
				this.ScoresView.constructPage(data);
			}, this);

			EventBus.subscribe('showPagination', usersCount => {
				this.ScoresModel.getUserScores(page);
				const data = {
					'ScoresPagination': {
						usersCount: usersCount,
						limit: this.ScoresModel.limit,
						currentPage: page,
						onPaginate: p => {
							this.go(`/scores/show/${p}`);
						}
					}
				};

				this.ScoresView.constuctPagintaion(data);
				this.ScshowPagination();
			}, this);

			this.ScoresModel.getUserCount();
		}
	}
	
}

export default ScoresController;