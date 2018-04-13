'use strict';

import Player from '../Player';
import GameEventBus from '../GameEventBus';
import * as noskin from '../bin/noskin.svg';
import Point from '../Point';
import Mode from '../core/Mode';

export default abstract class BonusObject {
	protected spawned: boolean = false;
	protected Coordinates: Point = new Point();

	constructor() {
		const Bus = GameEventBus;
		Bus.subscribe('STEPPED', (id, x_idx, y_idx) => {
			if (this.spawned && x_idx == this.Coordinates.x && y_idx == this.Coordinates.y) {
				const Player = Mode._players.filter(Player => {
					return Player.id == id;
				})[0];

				console.log(Mode._players)
				if (Player) {
					this.applied(Player, x_idx, id);
				}
			}
		}, this);
	}

	protected applyBonusToPlayers(Players: Array<Player>): void {
		const Bus = GameEventBus;
		Players.forEach(Player => {
			Bus.emit(this.getBonusName(), Player);
		})
	}

	protected applied(AppliedBy: Player, x: number = 0, y: number = 0) {
		this.spawned = false;
	}

	public spawn(x: number, y: number) {
		this.Coordinates.x = x;
		this.Coordinates.y = y;
		this.spawned = true;
	}

	public getSkin(): HTMLImageElement {
		const skin = new Image();
		skin.src = noskin;
		return skin;
	}

	public getBonusName(): string {
		return 'Base';
	}

	public isActive(): boolean {
		return this.spawned;
	}

	public position(): Point {
		return this.Coordinates;
	}
}