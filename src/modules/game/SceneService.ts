'use strict';
import GameField from "./GameField";
import Player from "./Player";
import {FIELD_SIZE, PLAYER_MAP, CELL_COUNT, CELL_SIZE} from "./defines";
import * as defaultAvatar from './bin/1.svg';

export default class SceneService {
	private _scene: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private avatarImg: HTMLImageElement;
	private readonly _palyerColor: Map<number, string>;
	private readonly _cellCount: number;

	constructor(scene: HTMLCanvasElement, userAvatar: string) {
		this._scene = scene;
		this._ctx = scene.getContext('2d');

		this.avatarImg = new Image();
		this.avatarImg.src = (userAvatar && userAvatar.length > 0) ? userAvatar : defaultAvatar;

		this._palyerColor = new Map();
		this._cellCount = CELL_COUNT;
		this.initPlayerColor();
	}

	private initPlayerColor(): void {
		PLAYER_MAP.forEach((k, v) => {
			this._palyerColor.set(v, k);
		});
	}

	public clear(): void {
		this._ctx.clearRect(0, 0, this.width, this.height);
	}

	public drawField(): void {
		const cellSize = this.height / this._cellCount;

		const cells = [];
		for (let i = 0; i < this._cellCount; i++) {
			let row = [];
			for (let j = 0; j < this._cellCount; j++) {
				row.push({
					color: '#ffffff'
				})
			}
			cells.push(row);
		}

		cells.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				this.drawCell(rowIndex, colIndex, cellSize, cell.color);
			});
		});
	}

	public drawPlayer(player: Player): void {
		const playerColor = this._palyerColor.get(player.id);
		this._ctx.strokeStyle = playerColor;
		this.bg(playerColor);
		const point = player.position;
		const scaleFactor = this.width > this.height ? this.height : this.width;
		const scale = scaleFactor / FIELD_SIZE;
		
		const x = point.x * scale-3;
		const y = point.y * scale-3;

		const radius = this.height / (this._cellCount * 2) * scale;
		const color = this._palyerColor.get(player.id);
		
		this._ctx.save();
		this._ctx.beginPath(); 
		this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this._ctx.fill();
		this._ctx.closePath();
		this._ctx.clip();

		const imgSize = CELL_SIZE * scale;
		console.log(radius, imgSize, CELL_SIZE)
		const imgPosX = x - CELL_SIZE * scale / 2;
		const imgPosY = y - CELL_SIZE * scale / 2;
		this._ctx.drawImage(this.avatarImg, imgPosX, imgPosY, imgSize, imgSize);
		this._ctx.restore();
	}

	private drawCell(row: number, col: number, size: number, color: string): void {
		const drawingSize = size - 5;
		this.bg(color, 0.7);
		this._ctx.fillRect(row * size, col * size, drawingSize, drawingSize);
	}

	private bg(color: string, opacity: number = 1) {
		this._ctx.globalAlpha = opacity;
		this._ctx.fillStyle = color;
	}

	public get width(): number {
		return this._scene.width;
	}

	public get height(): number {
		return this._scene.height;
	}
}