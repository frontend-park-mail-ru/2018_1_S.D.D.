'use strict';
import GameEventBus from './GameEventBus';

export default class GameField {
    private _idsMatrix: Array<Array<number>>;
    private _levelMatrix: Array<Array<number>>; 

    constructor (range: number = 8) {
        this._idsMatrix = new Array<Array<number>>(range);
        this._levelMatrix = new Array<Array<number>>(range);
        this.init(range);
    }

    private init (range: number = 8): void {
        //fill(undefined).
        //this._idsMatrix.fill(new Array<number>(range).fill(0));
        // think
        //this._levelMatrix.fill(undefined).map(() => Array<number>(range).fill(0)); 
        this._idsMatrix = Array(range).fill([]).map(() => Array(range).fill(0));

        const Bus = GameEventBus;
        Bus.subscribe('STEPPED',(id, x_idx, y_idx) => { this.markGameFieldCell(y_idx, x_idx, id) }, this);
    }

    public getGameMatrix(): Array<Array<number>> {
        return this._idsMatrix;
    }

    public markGameFieldCell(i, j: number, id: number): void {
        console.log(i,j,id);
        this._idsMatrix[i][j] = id;
        console.log( this._idsMatrix);
    }

    /** 
     * Maps ids matrix to color matrix (maybe not here)
     * 
     * 
    */
    public getColorMatrix () {
        
    }
}