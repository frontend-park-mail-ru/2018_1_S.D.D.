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
		return {
			userScores: [
				{ user: 'Vasya', score: 100},
				{ user: 'Anya', score: 200},
				{ user: 'Zhenya', score: 300},
				{ user: 'Anzhela', score: 400},
				{ user: 'Karolina', score: 500}
			]
		};
	}

	getUserScoresCount() {
		return 5;
	}
}

export default ScoresModel;
