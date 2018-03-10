'use strict';

import Model from './Model';

/**
 * Creates instance of ScoresModel
 * 
 * @class
 * @classdesc Scores model. Provide data for template rendering.
 */
class ScoresModel extends Model {
	/**
	 * Creates instance of ScoresModel
	 */
	constructor() {
		super();
	}
	
	/**
	 * Get menu links
	 * 
	 * @returns {Object} Object contains menu links.
	 */
	getMenuItems() {
		return {
			menuItems: [
				{ link:'/play', text:'PLAY' },
				{ link:'/scores', text:'SCORES' },
				{ link:'/rules', text:'RULES' },
				{ link:'/about', text:'ABOUT' }
			]
		};
	}

	/**
	* Get user scores
	*
	* @returns {Object} Object contains user scores
	*/
	getUserScores(pageNumber = 0, countUsers = 5) {
		const pages = pageNumber;
		const users = countUsers;

		if ((pages < 0) || (users < 0)) {
			return false;
		}
		return {
			userScores: [
				{ name: 'Vasya', score: 100},
				{ name: 'Anya', score: 200},
				{ name: 'Zhenya', score: 300},
				{ name: 'Anzhela', score: 400},
				{ name: 'Karolina', score: 500}
			]
		};
	}

	getUserScoresCount() {
		return 5;
	}

	getUserScoresTable() {

	}
}

export default ScoresModel;
