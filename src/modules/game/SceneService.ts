'use strict';
import GameField from "./GameField";
import Player from "./Player";
import {FIELD_SIZE, PLAYER_MAP, CELL_COUNT, CELL_COLOR_MAP} from "./defines";

export default class SceneService {
	private _scene: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private readonly _palyerColor: Map<number, string>;
	private readonly _cellCount: number;
	private readonly _cellColor: Map<number, string>;

	constructor(scene: HTMLCanvasElement) {
		this._scene = scene;
		this._ctx = scene.getContext('2d');
		this._palyerColor = new Map();
		this._cellColor = new Map();
		this._cellCount = CELL_COUNT;
		this.initPlayerColor();
		this.initCellColor();
	}

	private initCellColor(): void {
		CELL_COLOR_MAP.forEach((v, k) => {
			this._cellColor.set(k, v);
		})
	}

	private initPlayerColor(): void {
		PLAYER_MAP.forEach((v, k) => {
			this._palyerColor.set(k, v);
		});
	}

	public clear(): void {
		this._ctx.clearRect(0, 0, this.width, this.height);
	}

	public drawField(matrix: Array<Array<number>>): void {
		const cellSize = this.height / this._cellCount;

		const cells = [];
		matrix.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				this.drawCell(rowIndex, colIndex, cellSize, this._cellColor.get(cell));
			});
		});
	}

	public drawPlayer(player: Player): void {
		this._ctx.strokeStyle = this._palyerColor.get(player.id);
		const point = player.position;
		const scaleFactor = this.width > this.height ? this.height : this.width;
		const scale = scaleFactor / FIELD_SIZE;
		
		const x = point.x * scale-3;
		const y = point.y * scale-3;

		const radius = this.height / (this._cellCount * 2) * scale;
		const color = this._palyerColor.get(player.id);

		this._ctx.beginPath(); 
		this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this._ctx.fill();
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