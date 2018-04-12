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
			Player.velocity = Player.velocity / 2;
		}, this);
	}

	applied(AppliedBy: Player, Players: Array<Player> = [], Field: GameField = null) {
		this.applyBonusToPlayers([AppliedBy]);
	}

	getSkin(): HTMLImageElement {
		return this.skin;
	}

	getBonusName(): string {
		return 'BONUS:SLOW';
	}
}