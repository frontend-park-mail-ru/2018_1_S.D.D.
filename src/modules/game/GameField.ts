'use strict';
import GameEventBus from './GameEventBus';
import Point from './Point';

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

        this._idsMatrix[0][0] = 1;
        this._idsMatrix[0][7] = 2;
        this._idsMatrix[7][7] = 3;
        this._idsMatrix[7][0] = 4;

        const Bus = GameEventBus;
        Bus.subscribe('STEPPED',(id, x_idx, y_idx) => { this.markGameFieldCell(y_idx, x_idx, id) }, this);
    }

    public getGameMatrix(): Array<Array<number>> {
        return this._idsMatrix;
    }

    // remember: Point(x,y) => x - col, y - row
    private isDotValid(dotToCheck, id): boolean {
        if ((dotToCheck.x > 0 && dotToCheck.x < 7) && // not on first or last col
            (dotToCheck.y > 0 && dotToCheck.y < 7) && // not on first or last row
            (this._idsMatrix[dotToCheck.y][dotToCheck.x] != id)) // not obtained by that player
            return true;
        else 
            return false; 
    }

    private getArrayOfPointsToCheck(i, j, id) {
        let array = [];

        let dotToCheck: Point; // remember: Point(x,y) => x - col, y - row

        // checking top left varint
        //  *00
        //  010
        //  000
        dotToCheck = new Point(j-1,i-1);
        if (this.isDotValid(dotToCheck,id)) {

        }


    }

    private checkArea(i, j: number, id: number): void {
        let matrix = this._idsMatrix;

        const stack = [];
    }

    public markGameFieldCell(i, j: number, id: number): void {
        console.log(i,j,id);
        if (this._idsMatrix[i][j] != id) {
            this._idsMatrix[i][j] = id;
        } else {
            this.checkArea(i,j, id);
        }
            
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