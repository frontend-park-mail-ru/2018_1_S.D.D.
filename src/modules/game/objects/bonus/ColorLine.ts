'use strict';

import Player from '../player/Character';
import GameEventBus from '../../GameEventBus';
import * as arrow from '../../bin/rowarrow.svg';
import BonusObject from './BonusObject';
import Field from '../field/Field';
import Point from '../Point';
import Game from '../../core/Game';

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
		Bus.subscribe(this.getBonusName(), (position, PlayerId) => {
			for (let tx = 0; tx < Field.range; tx++) {
				Game.Field.markCell(new Point(tx, position.y), PlayerId);
			}	
		}, this);
	}

	applied(AppliedBy: Player, position = new Point(0, 0)) {
		this.spawned = false;
		this.applyBonusToField(AppliedBy, position);
	}

	getSkin(): HTMLImageElement {
		return this.skin;
	}

	getBonusName(): string {
		return 'BONUS:COLORROW';
	}
}