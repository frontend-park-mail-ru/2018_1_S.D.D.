'use strict';

import * as clock from '../../bin/clock.svg';
import GameEventBus from '../../GameEventBus';
import Scene from '../../Scene';
import GameField from '../field/Field';
import Player from '../player/Character';
import Point from '../Point';
import BonusObject from './BonusObject';

/**
 * Register StuckAll bonus.
 *
 * @class
 * @classdesc Stuck enemies.
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
        this.skin.src = clock;
        this.registerBonus();
    }

    /**
     * Register bonus. Provide behaviour on appliement.
     */
    public registerBonus() {
        GameEventBus.subscribe(this.getBonusName(), (Player) => {
            const currentVelocity = Player.velocity;
            Player.velocity = 0;
            setTimeout(() => {
                Player.velocity = currentVelocity;
            }, 5000);
        }, this);
    }

    /**
     * Apply bonus to player.
     *
     * @param AppliedBy Player who gets bonus.
     * @param position Bonus position.
     */
	   public applied(AppliedBy: Player, position: Point = new Point(0, 0)) {
        this.spawned = false;
        const cell = Scene.Field.item((Cell) => {
            return Cell.position.x === position.x &&
            Cell.position.y === position.y;
        });
        cell.busy = false;
        const enemies = Scene.Players.get().filter((Player) => {
            return Player.id !== AppliedBy.id;
        });
		      this.applyBonusToPlayers(enemies);
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
		return 'BONUS:STUCK';
	}
}
