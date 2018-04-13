'use strict';

import Player from '../Player';
import GameEventBus from '../GameEventBus';
import * as slowpoke from '../bin/slowpoke.svg';
import BonusObject from './BonusObject';
import GameField from '../GameField';

export default class SlownessBonus extends BonusObject {
	private skin: HTMLImageElement;

	constructor () {
		super();
		this.skin = new Image();
		this.skin.src = slowpoke;
		this.registerBonus();
	}

	registerBonus() {
		const Bus = GameEventBus;
		Bus.subscribe(this.getBonusName(), Player => {
			const currentVelocity = Player.velocity;
			Player.velocity = currentVelocity / 2;
			setTimeout(() => {
				Player.velocity = currentVelocity;
			}, 10000);
		}, this);
	}

	applied(AppliedBy: Player, x: number = 0, y: number = 0) {
		this.spawned = false;
		this.applyBonusToPlayers([AppliedBy]);
	}

	getSkin(): HTMLImageElement {
		return this.skin;
	}

	getBonusName(): string {
		return 'BONUS:SLOW';
	}
}