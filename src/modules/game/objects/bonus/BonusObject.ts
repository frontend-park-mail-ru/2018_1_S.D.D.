'use strict';

import * as noskin from '../../bin/noskin.svg';
import GameEventBus from '../../GameEventBus';
import Scene from '../../Scene';
import Drawable from '../Drawable';
import Cell from '../field/Cell';
import Player from '../player/Character';
import Point from '../Point';

/**
 * Subscribe on 'STEPPED' event.
 *
 * @class
 * @classdesc Base bonus. Provides common behavior for all bonuses.
 */
export default abstract class BonusObject extends Drawable {
    /**
     * Timestamp when bonus spawned last time.
     */
    public static lastSpawned: number = -1;

    /**
     * Is bonus already on field or not.
     */
    protected spawned: boolean = false;

    /**
     * Bonus position.
     */
    protected Coordinates: Point = new Point();

    /**
     * Subscribe on 'STEPPED' event.
     */
    constructor() {
        super();
        GameEventBus.subscribe('STEPPED', (id, position) => {
            if (this.spawned && position.x == this.Coordinates.x && position.y == this.Coordinates.y) {
                const Player = Scene.Players.get().filter((Player) => {
                    return Player.id == id;
                })[0];

                if (Player) {
                    this.applied(Player, position);
                }
            }
        }, this);
    }

    /**
     * Apply bonus to players.
     *
     * @param Players Players affected to bonus.
     */
    protected applyBonusToPlayers(Players: Player[]): void {
        Players.forEach((Player) => {
            GameEventBus.emit(this.getBonusName(), Player);
        });
    }

    /**
     * Mark field cell in player color.
     *
     * @param Player Player who will color field..
     * @param position Which cell will be colored.
     */
    protected applyBonusToField(Player: Player, position: Point): void {
        GameEventBus.emit(this.getBonusName(), [position, Player.id]);
    }

    /**
     * Action when player get the bonus.
     *
     * @param AppliedBy Player who get the bonus.
     * @param position Bonus position.
     */
    protected applied(AppliedBy: Player, position: Point) {
        this.spawned = false;
    }

    /**
     * Spawn bonus on field.
     *
     * @param position Position to spawn bonus.
     */
    public spawn(position: Point): void {
        this.Coordinates.x = position.x;
        this.Coordinates.y = position.y;
        this.spawned = true;
    }

    /**
     * Get bonus image.
     *
     * @returns Bonus image.
     */
    public getSkin(): HTMLImageElement {
        const skin = new Image();
        skin.src = noskin;
        return skin;
    }

    /**
     * Bonus name.
     *
     * @returns Bonus name.
     */
    public getBonusName(): string {
        return 'Base';
    }

    /**
     * Did bonus spawned on field or not?
     *
     * @returns Flag if bonus spawned on field.
     */
    public isActive(): boolean {
        return this.spawned;
    }

    /**
     * Get bonus poistion.
     *
     * @returns Bonus position.
     */
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
