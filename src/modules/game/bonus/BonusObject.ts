'use strict';

import Player from '../Player';
import GameEventBus from '../GameEventBus';
import * as noskin from '../bin/noskin.svg';

export default abstract class BonusObject {
	constructor() {

	}

	applyBonusToPlayers(Players: Array<Player>): void {
		const Bus = GameEventBus;
		Players.forEach(Player => {
			Bus.emit(this.getBonusName(), Player);
		})
	}

	getSkin(): HTMLImageElement {
		const skin = new Image();
		skin.src = noskin;
		return skin;
	}

	getBonusName(): string {
		return 'Base';
	}
}