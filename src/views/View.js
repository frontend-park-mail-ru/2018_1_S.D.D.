'use strict';

class View {
	/**
     * Creates instance of Viewe
     */
	constructor() {
		if(View._instance) {
			return View._instance;
		}
		View._instance = this;

	}

	/** 
     * Display page.
    */
	show() {

	}
}

export default View;