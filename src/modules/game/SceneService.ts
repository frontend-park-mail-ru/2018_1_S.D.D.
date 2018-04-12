'use strict';

import GameField from "./GameField";

export default class SceneService {
	_scene: HTMLCanvasElement;
	_ctx: CanvasRenderingContext2D;

	constructor(scene: HTMLCanvasElement) {
		this._scene = scene;
		this._ctx = scene.getContext('2d');
	}

	public clear(): void {
		this._ctx.clearRect(0, 0, this.width, this.height);
	}

	public drawField(): void {
		const cellSize = this.height / 8;

		const cells = [];
		for (let i = 0; i < 8; i++) {
			let row = [];
			for (let j = 0; j < 8; j++) {
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