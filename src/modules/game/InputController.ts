'use strict';

import GameEventBus from './GameEventBus';

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const SPACE_KEY = 32;

/**
 * Sets handler on key pressed event.
 *
 * @class
 * @classdesc Executes handler on arrow keys.
 */
export default class InputController {
    /**
     *
     * @param id Id of current player.
     */
    constructor(id: number) {
        const Bus = GameEventBus;

        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
            case LEFT_KEY:
                Bus.emit(`MOVE.LEFT:${id}`);
                break;
            case RIGHT_KEY:
                Bus.emit(`MOVE.RIGHT:${id}`);
                break;
            case UP_KEY:
                Bus.emit(`MOVE.UP:${id}`);
                break;
            case DOWN_KEY:
                Bus.emit(`MOVE.DOWN:${id}`);
                break;
            case SPACE_KEY:
                Bus.emit('PRESSED:SPACE');
                break;
            }
        });
    }
}
