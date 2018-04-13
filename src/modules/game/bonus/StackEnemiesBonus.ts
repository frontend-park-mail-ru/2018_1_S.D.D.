'use strict';

import Player from '../Player';
import GameEventBus from '../GameEventBus';
import * as clock from '../bin/clock.svg';
import BonusObject from './BonusObject';
import GameField from '../GameField';
import Mode from '../core/Mode'

export default class SlownessBonus extends BonusObject {
	private skin: HTMLImageElement;

	constructor () {
		super();
		this.skin = new Image();
		this.skin.src = clock;
		this.registerBonus();
	}

	registerBonus() {
		const Bus = GameEventBus;
		Bus.subscribe(this.getBonusName(), Player => {
			const currentVelocity = Player.velocity;
			Player.velocity = 0;
			setTimeout(() => {
				Player.velocity = currentVelocity;
			}, 5000);
		}, this);
	}

	applied(AppliedBy: Player, x: number = 0, y: number = 0) {
		this.spawned = false;
		const Enemies = Mode._players.filter(Player => {
			return Player.id !== AppliedBy.id;
		});
		this.applyBonusToPlayers(Enemies);
	}

	getSkin(): HTMLImageElement {
		return this.skin;
	}

	getBonusName(): string {
		return 'BONUS:STACKENEMY';
	}
}