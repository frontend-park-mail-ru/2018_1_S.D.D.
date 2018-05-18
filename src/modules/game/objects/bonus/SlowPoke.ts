'use strict';

import * as slowpoke from '../../bin/slowpoke.svg';
import GameEventBus from '../../GameEventBus';
import Scene from '../../Scene';
import GameField from '../field/Field';
import Character from '../player/Character';
import Point from '../Point';
import BonusObject from './BonusObject';

/**
 * Register SlowPoke bonus.
 *
 * @class
 * @classdesc Make player slower.
 */
export default class SlownessBonus extends BonusObject {
    /**
     * Bonus image.
     */
    private skin: HTMLImageElement;

    /**
     * Register bonus and set image skin.
     */
    constructor () {
        super();
        this.skin = new Image();
        this.skin.src = slowpoke;
        this.registerBonus();
    }

    /**
     * Register bonus. Provide behaviour on appliement.
     */
    public registerBonus() {
        GameEventBus.subscribe(this.getBonusName(), (Player) => {
            const currentVelocity = Player.velocity;
            Player.velocity = currentVelocity / 2;
            setTimeout(() => {
                Player.velocity = currentVelocity;
            }, 10000);
        }, this);
    }

    /**
     * Apply bonus to player.
     *
     * @param AppliedBy Player who gets bonus.
     * @param position Bonus position.
     */
    public applied(AppliedBy: Character, position: Point = new Point(0, 0)) {
        this.spawned = false;
        const cell = Scene.Field.item((Cell) => {
            return Cell.position.x === position.x &&
            Cell.position.y === position.y;
        });
        cell.busy = false;
        this.applyBonusToPlayers([AppliedBy]);
    }

    /**
     * Get bonus image.
     *
     * @returns Bonus image.
     */
    public getSkin(): HTMLImageElement {
        return this.skin;
    }

    /**
     * Get bonus name.
     *
     * @returns Bonus name.
     */
    public getBonusName(): string {
        return 'BONUS:SLOW';
    }
}
