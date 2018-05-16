'use strict';

import Player from '../player/Character';
import GameEventBus from '../../GameEventBus';
import * as noskin from '../../bin/noskin.svg';
import Point from '../Point';
import Scene from '../../Scene';
import Drawable from '../Drawable';
import Cell from '../field/Cell';

export default abstract class BonusObject extends Drawable {
    public static lastSpawned: number = -1;
    protected spawned: boolean = false;
    protected Coordinates: Point = new Point();

    constructor() {
        super();
        GameEventBus.subscribe('STEPPED', (id, position) => {
            if (this.spawned && position.x == this.Coordinates.x && position.y == this.Coordinates.y) {
                const Player = Scene.Players.get().filter(Player => {
                    return Player.id == id;
                })[0];

                if (Player) {
                    this.applied(Player, position);
                }
            }
        }, this);
    }

    protected applyBonusToPlayers(Players: Array<Player>): void {
        Players.forEach(Player => {
            GameEventBus.emit(this.getBonusName(), Player);
        })
    }

    protected applyBonusToField(Player: Player, position: Point) {
        const Bus = GameEventBus;
        Bus.emit(this.getBonusName(), [position, Player.id]);
    }

    protected applied(AppliedBy: Player, position: Point) {
        this.spawned = false;
    }

    public spawn(position: Point) {
        this.Coordinates.x = position.x;
        this.Coordinates.y = position.y;
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

    /**
     * Draw bonus.
     */
    public draw(): void {
        if (this.isActive()) {
            const margin = 5 * this.scale;
            const border = 4 * this.scale;
            const radius = (Cell.size / 2) - margin;
            const imgSize = radius * 2 - border * 2;

            // x, y - center
            const startx = this.Coordinates.x * Cell.realSize;
            const starty = this.Coordinates.y * Cell.realSize;
            const x = startx + Cell.size / 2 + margin / 2;
            const y = starty + Cell.size / 2 + margin / 2;

            // PosX, PosY - top left corner
            const imgPosX = x - imgSize / 2;
            const imgPosY = y - imgSize / 2;

            this.image(this.getSkin(), imgPosX, imgPosY, imgSize);
        }
    }
}