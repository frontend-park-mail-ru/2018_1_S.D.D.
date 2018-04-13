'use strict';

import Player from '../Player';
import GameEventBus from '../GameEventBus';
import * as arrow from '../bin/rowarrow.svg';
import BonusObject from './BonusObject';
import GameField from '../GameField';
import Mode from '../core/Mode'

export default class ColorRowBonus extends BonusObject {
	private skin: HTMLImageElement;

	constructor () {
		super();
		this.skin = new Image();
		this.skin.src = arrow;
		this.registerBonus();
	}

	registerBonus() {
		const Bus = GameEventBus;
		Bus.subscribe(this.getBonusName(), (Field, x, y, PlayerId) => {
			for (let tx = 0; tx < 8; tx++) {
				Field.markGameFieldCell(y, tx, PlayerId);
				console.log(tx, y);
			}	
		}, this);
	}

	applied(AppliedBy: Player, x: number = 0, y: number = 0) {
		this.spawned = false;
		this.applyBonusToField(AppliedBy, x, y);
	}

	getSkin(): HTMLImageElement {
		return this.skin;
	}

	getBonusName(): string {
		return 'BONUS:COLORROW';
	}
}