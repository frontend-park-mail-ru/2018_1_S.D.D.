'use strict';

class MathUtils {

	/**
     * @param {array} verticles 
     * @param {array} links
     * 
     */
	static algoritmLi (verticles, links) {
		var cycles = [];
		// its crutch
		links.forEach(element => {
			verticles.push(element);
		});
		return cycles;
	}

}

export default MathUtils;