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
		if (ScoresController.__instance) {
			return ScoresController.__instance;
		}
		ScoresController.__instance = this;

		this.ScoresModel = new ScoresModel();
		this.ScoresView = new ScoresView();
		this.addActions();
		this.subscribeEvents();
	}

	/**
	 * Add actions to controller.
	 */
	addActions() {
		this.addAction('index', this.actionIndex);
		this.addAction('show', this.actionShow);
	}

	subscribeEvents() {
		const EventBus = this.ServiceManager.EventBus;
		EventBus.subscribe('showScoresTable', (usersList, userPosition) => { 
			this.showScoresTable(usersList, userPosition);
		}, this);
		EventBus.subscribe('showPagination', usersCount => {
			this.showPagination(usersCount);
		} , this);
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
			this.page = page;
			this.ScoresModel.getUserScores(page)
				.then(() => {
					this.ScoresModel.getUserCount();
				});
		}
	}

	showScoresTable(usersList, userPosition) {
		const User = this.ServiceManager.UserStorage;
		const data = {
			'Scores': {
				data: usersList,
				me: {
					'place': userPosition + 1,
					'nickname': User.getData('nickname'),
					'email':  User.getData('email'),
					'countGames':  User.getData('countGames'),
					'countWins':  User.getData('countWins'),
					'rating':  User.getData('rating')
				}
			},
			'Header': this.getHeaderData()
		};
		this.ScoresView.constructScores(data);
	}

	showPagination(usersCount) {
		const data = {
			'ScoresPagination': {
				usersCount: usersCount,
				limit: this.ScoresModel.limit,
				currentPage: this.page,
				onPaginate: p => {
					this.go(`/scores/show/${p}`);
				}
			}
		};
		
		this.ScoresView.constructPagination(data);
	}
	
}

export default ScoresController;