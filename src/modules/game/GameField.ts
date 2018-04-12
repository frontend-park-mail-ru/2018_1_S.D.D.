'use strict';

export default class GameField {
    private readonly _idsMatrix: Array<Array<number>>;
    private readonly _levelMatrix: Array<Array<number>>; 

    constructor (range: number = 8) {
        this._idsMatrix = new Array<Array<number>>();
        this._levelMatrix = new Array<Array<number>>();
        this.init(range);
    }

    public init (range: number = 8): void {
        this._idsMatrix.fill(undefined).map(() => Array<number>(range).fill(0));
        // think
        this._levelMatrix.fill(undefined).map(() => Array<number>(range).fill(0));        
    }

    public getGameMatrix(): Array<Array<number>> {
        return this._idsMatrix;
    }

    public markGameFieldCell(i, j: number, id: number): void {
        this._idsMatrix[i][j] = id;
    }

    /** 
     * Maps ids matrix to color matrix (maybe not here)
     * 
     * 
    */
    public getColorMatrix () {
        
    }
}