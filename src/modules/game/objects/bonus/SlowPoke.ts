'use strict';

import Player from '../player/Character';
import GameEventBus from '../../GameEventBus';
import * as slowpoke from '../../bin/slowpoke.svg';
import BonusObject from './BonusObject';
import GameField from '../field/Field';
import Point from '../Point';
import Scene from '../../Scene';

export default class SlownessBonus extends BonusObject {
    private skin: HTMLImageElement;

    constructor () {
        super();
        this.skin = new Image();
        this.skin.src = slowpoke;
        this.registerBonus();
    }

    registerBonus() {
        GameEventBus.subscribe(this.getBonusName(), Player => {
            const currentVelocity = Player.velocity;
            Player.velocity = currentVelocity / 2;
            setTimeout(() => {
                Player.velocity = currentVelocity;
            }, 10000);
        }, this);
    }

	applied(AppliedBy: Player, position: Point = new Point(0, 0)) {
        this.spawned = false;
        const cell = Scene.Field.item(Cell => {
            return Cell.position.x === position.x &&
            Cell.position.y === position.y;
        });
        cell.busy = false;
		this.applyBonusToPlayers([AppliedBy]);
	}

	getSkin(): HTMLImageElement {
		return this.skin;
	}

	getBonusName(): string {
		return 'BONUS:SLOW';
	}
}