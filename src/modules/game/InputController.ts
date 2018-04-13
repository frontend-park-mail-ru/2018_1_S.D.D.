'use strict';

import GameEventBus from './GameEventBus';

const LEFT_KEY = 37;
const LEFT_KEY_MAC = 123;
const UP_KEY = 38;
const UP_KEY_MAC = 126;
const RIGHT_KEY = 39;
const RIGHT_KEY_MAC = 124;
const DOWN_KEY = 40;
const DOWN_KEY_MAC = 125;
const SPACE_KEY = 32;

export default class InputController {
	constructor() {
		const Bus = GameEventBus;

		document.addEventListener('keydown', event => {
			switch (event.keyCode) {
			case LEFT_KEY:
			case LEFT_KEY_MAC:
				Bus.emit('PRESSED:LEFT');
				break;
			case RIGHT_KEY:
			case RIGHT_KEY_MAC:
				Bus.emit('PRESSED:RIGHT');
				break;
			case UP_KEY:
			case UP_KEY_MAC:
				Bus.emit('PRESSED:UP');
				break;
			case DOWN_KEY:
			case DOWN_KEY_MAC:
				Bus.emit('PRESSED:DOWN');
				break;
			case SPACE_KEY:
				Bus.emit('PRESSED:SPACE');
				break;
			}
		});
	}
}