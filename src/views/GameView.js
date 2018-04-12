'use strict';
import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import SceneTemplate from '../ui/templates/scene/';

class GameView extends View {
	constructor() {
		super();
	}

	constructPage() {
		return this.onLoad([
			['Scene', SceneTemplate, { block: 'main' }],
			['Header', HeaderTemplate, { appendFirst: true }]
		])
			.then(() => {
				this.showPage();
				SceneTemplate.setSize(this.load('Scene'), this.getBlock('main'));
				window.addEventListener('resize', () => {
					SceneTemplate.setSize(this.load('Scene'), this.getBlock('main'));
				});
			});
	}

	getScene() {
		return SceneTemplate.getScene(this.load('Scene'));
	}

	showPage() {
		this.show('Header');
		HeaderTemplate.showLogo();
		this.show('Scene');
	}
}

export default GameView;