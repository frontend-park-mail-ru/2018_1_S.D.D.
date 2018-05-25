'use strict';

import GameEventBus from './GameEventBus';
import Scene from './Scene';

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const SPACE_KEY = 32;

const MIN_SWAP = 30;

/**
 * Sets handler on key pressed event.
 *
 * @class
 * @classdesc Executes handler on arrow keys.
 */
export default class InputController {

    private SX = 0;
    private EX = 0;
    private SY = 0;
    private EY = 0;

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

        Scene.sceneCanvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.SX = event.touches[0].screenX;
            this.SY = event.touches[0].screenY;
            this.EX = this.SX;
            this.EY = this.SY;
        });

        Scene.sceneCanvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            this.EX = event.touches[0].screenX;
            this.EY = event.touches[0].screenY;
        });

        Scene.sceneCanvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            const hor = this.EX - this.SX;
            const ver = this.EY - this.SY;
            if (Math.abs(hor) > Math.abs(ver)) {
                if (Math.abs(hor) > MIN_SWAP) {
                    if (hor > 0) {
                        Bus.emit(`MOVE.RIGHT:${id}`);
                    } else {
                        Bus.emit(`MOVE.LEFT:${id}`);
                    }
                }
            } else {
                if (Math.abs(ver) > MIN_SWAP) {
                    if (ver > 0) {
                        Bus.emit(`MOVE.DOWN:${id}`);
                    } else {
                        Bus.emit(`MOVE.UP:${id}`);
                    }
                }
            }
        });
    }
}
