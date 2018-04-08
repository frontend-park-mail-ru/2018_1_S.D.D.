'use strict';
import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import SceneTemplate from '../ui/templates/scene/';

class GameView extends View {
	constructor() {
		super();
	}
    
	constructPage() {
	//	return new Promise(resolve => {
        	this.load('Scene', SceneTemplate, { block: 'main' });
		this.load('Header', HeaderTemplate, { appendFirst: true });
	//	}).thenтbind(this);      
	}

	showPage() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Scene');
	}
}

export default GameView;