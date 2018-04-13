'use strict';
import GameField from "./GameField";
import Player from "./Player";
import {FIELD_SIZE, PLAYER_MAP, CELL_COUNT, CELL_SIZE, CELL_COLOR_MAP} from "./defines";
import BonusObject from "./bonus/BonusObject";
import Point from "./Point";
import GameEventBus from "./GameEventBus";

export default class SceneService {
	private _scene: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private readonly _palyerColor: Map<number, string>;
	private readonly _cellCount: number;
	private readonly _cellColor: Map<number, string>;

	constructor(scene: HTMLCanvasElement) {
		this._scene = scene;
		this._ctx = scene.getContext('2d');
		this._ctx.font = "30px Arial";
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
		this._ctx.font = "30px Arial";
	}

	public drawField(matrix: Array<Array<number>>): void {
		const cellSize = this.height / this._cellCount;

		const cells = [];
		matrix.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				this.drawCell(colIndex, rowIndex, cellSize, this._cellColor.get(cell));
			});
		});
	}

	public drawPlayer(player: Player): void {
		const playerColor = this._palyerColor.get(player.id);
		this._ctx.fillStyle = playerColor;
		this.bg(playerColor);
		const point = player.position;
		const scaleFactor = this.width > this.height ? this.height : this.width;
		const scale = scaleFactor / FIELD_SIZE;
		
		const x = point.x * scale-3;
		const y = point.y * scale-3;

		//const radius = this.height / (this._cellCount * 2) * scale - 5;
		const radius = (CELL_SIZE/2-10)*scale;
		const color = this._palyerColor.get(player.id);
		
		this._ctx.save();
		this._ctx.beginPath(); 
		this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this._ctx.fill();
		this._ctx.closePath();
		this._ctx.clip();

		const imgSize = radius * 2 - 8;
		//const imgPosX = x - CELL_SIZE * scale / 2 + (CELL_SIZE * scale - imgSize) / 2;
		const imgPosX = x-imgSize/2;
		//const imgPosY = y - CELL_SIZE * scale / 2 + (CELL_SIZE * scale - imgSize) / 2;
		const imgPosY = y-imgSize/2;
		this._ctx.drawImage(player.avatar, imgPosX, imgPosY, imgSize, imgSize);
		this._ctx.restore();
	}

	drawPlayerInfo(players: Player[], timer: number): void {
		let infoFieldWidth = this.width - this.height;
		let startPosition = this.height;
		let imageSize = this.height / (this._cellCount);
		
		const scaleFactor = this.width > this.height ? this.height : this.width;		
		const scale = scaleFactor / FIELD_SIZE;
		const radius = this.height / (this._cellCount * 2) * scale;
		const arrNames = [];
		
		players.forEach(player => {
			arrNames.push(player.name);
		});

		this._ctx.textAlign='left';
		let maxName = arrNames.reduce((a, b) => { return a.length > b.length ? a : b; });
		let maxTextWidth = this._ctx.measureText(maxName).width; 
		let contextWidth = maxTextWidth;
		let marginLeft = (infoFieldWidth - contextWidth) / 2;

		// crutch, approximaete max heigth as width M		
		let maxNameHeight = this._ctx.measureText('M').width * scale;		
		let imgSize = maxNameHeight * 2 * scale;		
		let contentHeight = (imgSize * 4 + maxNameHeight) * scale;
		let startY = (this.height - contentHeight) / 2;
		let contentMargin = 30  * scale;
		let start = (startY + 100)  * scale;
		let startX = startPosition + marginLeft;
		this.bg('#FFFFFF');
		this._ctx.font = `${30 * scale}px Arial`;
		this._ctx.fillText(`Time left: ${timer.toString()}`, startX + contentMargin, start - 80);
		players.forEach(player => {
			this.bg(this._palyerColor.get(player.id));
			this._ctx.save();
			this._ctx.beginPath(); 
			this._ctx.save();
			this._ctx.arc(startX - imgSize / 2, (start - maxNameHeight  / (2 * scale)) * scale, imgSize / 2, 0, 2 * Math.PI);
			this._ctx.fill();
			this._ctx.closePath();
			this._ctx.clip();
			this._ctx.drawImage(player.avatar, startX - imgSize, start - maxNameHeight * 1.5, imgSize, imgSize);
			this._ctx.restore();
			this._ctx.fillText(player.name, startX + contentMargin, start);
			this._ctx.fillText(player.score.toString(), startX + 2*contentMargin + maxTextWidth, start);

			start += imgSize + maxNameHeight;
		});
	}
	
	public drawBonus(Bonus: BonusObject) {
		if (Bonus.isActive()) {
			const Coordinates = Bonus.position();
			const scaleFactor = this.width > this.height ? this.height : this.width;
			const scale = scaleFactor / FIELD_SIZE;

			//const imgSize = (this.height / (this._cellCount * 2) * scale - 5) * 1.3;
			const imgSize  = (CELL_SIZE-40) * scale;
			//const imgPosX = Coordinates.x * CELL_SIZE * scale + (CELL_SIZE * scale - imgSize) / 2;
			const imgPosX = (Coordinates.x * CELL_SIZE + 17) * scale;
			//const imgPosY = Coordinates.y * CELL_SIZE * scale + (CELL_SIZE * scale - imgSize) / 2;
			const imgPosY = (Coordinates.y * CELL_SIZE + 17) * scale;
			this._ctx.drawImage(Bonus.getSkin(), imgPosX, imgPosY, imgSize, imgSize);
		}
	}

	public awaitScreen() {
		this.text('PRESS SPACE TO START GAME');
	}

	public pauseScreen() {
		this.bg('#FFFFFF', 0.2);
		this._ctx.fillRect(0, 0, this.width, this.height);
		this.text('PRESS SPACE TO RESUME GAME');
	}

	public gameOverScreen(Players: Array<Player>) {
		let Winner = Players[0];
		let youWon = true;
		Players.forEach((Player, index) => {
			if(Player.score > Winner.score) {
				Winner = Player;
				youWon = index == 0;
			}
		});

		this.bg('#FFFFFF', 0.8);
		this._ctx.fillRect(0, 0, this.width, this.height);
		if (youWon) {
			this.text('CONGRATULATIONS! YOU WON VS OUR SMART BOTS!', '#73DB56');
		} else {
			this.text('GAME OVER! \n YOU LOST! BETTER LUCK NEXT TIME', '#FF5A5A');
		}
	}

	public prepareScreen() {
		const Bus = GameEventBus;
		let counter = 4;
		this.clear();
		this.text(`PREPARE: ${counter - 1}`);
		const interval = setInterval(() => {
			counter--;
			this.clear();
			this.text(`PREPARE: ${counter - 1}`);
			if (counter == 1) {
				clearInterval(interval);
				Bus.emit('START');

			}
		}, 1000);
	}

	public text(txt: string, color: string = '#FFFFFF') {
		this.bg(color);
		this._ctx.textAlign='center';
		this._ctx.fillText(txt, this.width / 2, this.height / 2);
	}

	private drawCell(row: number, col: number, size: number, color: string): void {
		const drawingSize = size - 5;
		this.bg(color, 0.6);
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