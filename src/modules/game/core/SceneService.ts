'use strict';

export default class SceneService {
	_scene: HTMLCanvasElement;
	_ctx: CanvasRenderingContext2D;

	constructor(scene: HTMLCanvasElement) {
		this._scene = scene;
		this._ctx = scene.getContext('2d');
	}

	clear(): void {
		this._ctx.fillStyle = '#000000';
		this._ctx.strokeRect(0, 0, this.width, this.height);
	}

	get width(): number {
		return this._scene.width;
	}

	get height(): number {
		return this._scene.height;
	}
}