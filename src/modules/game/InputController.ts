'use strict';

import GameEventBus from './GameEventBus';

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const SPACE_KEY = 32;

export default class InputController {
	constructor() {
		const Bus = GameEventBus;

		document.addEventListener('keydown', event => {
			switch (event.keyCode) {
			case LEFT_KEY:
				Bus.emit('PRESSED:LEFT');
				break;
			case RIGHT_KEY:
				Bus.emit('PRESSED:RIGHT');
				break;
			case UP_KEY:
				Bus.emit('PRESSED:UP');
				break;
			case DOWN_KEY:
				Bus.emit('PRESSED:DOWN');
				break;
			case SPACE_KEY:
				Bus.emit('PRESSED:SPACE');
				break;
			}
		});
	}
}