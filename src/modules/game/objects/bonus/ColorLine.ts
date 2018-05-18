'use strict';

import * as arrow from '../../bin/rowarrow.svg';
import Game from '../../core/Game';
import GameEventBus from '../../GameEventBus';
import Field from '../field/Field';
import Player from '../player/Character';
import Point from '../Point';
import BonusObject from './BonusObject';

/**
 * Register ColorLine bonus.
 *
 * @class
 * @classdesc Color whole line on field.
 */
export default class ColorRowBonus extends BonusObject {
    /**
     * Bonus image.
     */
    private skin: HTMLImageElement;

    /**
     * Register bonus and set image skin.
     */
    constructor() {
        super();
        this.skin = new Image();
        this.skin.src = arrow;
        this.registerBonus();
    }

    /**
     * Register bonus. Provide behaviour on appliement.
     */
    public registerBonus(): void {
        const Bus = GameEventBus;
        Bus.subscribe(this.getBonusName(), (position, PlayerId) => {
            for (let tx = 0; tx < Field.range; tx++) {
                if (tx > 0) {
                    const prev = new Point(tx - 1, position.y);
                    Game.Field.markCell(new Point(tx, position.y), PlayerId, prev);
                } else {
                    Game.Field.markCell(new Point(tx, position.y), PlayerId);
                }
            }
        }, this);
    }

    /**
     * Apply bonus to field.
     *
     * @param AppliedBy Player who gets bonus.
     * @param position Bonus position.
     */
    public applied(AppliedBy: Player, position = new Point(0, 0)): void {
        this.spawned = false;
        this.applyBonusToField(AppliedBy, position);
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
        return 'BONUS:COLORROW';
    }
}
