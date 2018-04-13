'use strict';
import GameEventBus from './GameEventBus';
import Point from './Point';

export default class GameField {
    private _idsMatrix: Array<Array<number>>;
    private _levelMatrix: Array<Array<number>>; 
    private _range: number;

    constructor (range: number = 8) {
        this._idsMatrix = new Array<Array<number>>(range);
        this._levelMatrix = new Array<Array<number>>(range);
        this._range = range;
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

    public getGameMatrixCopy(): Array<Array<number>> {
        let matrix = new Array<Array<number>>(this._range);
        matrix = Array(this._range).fill([]).map(() => Array(this._range).fill(0));
        
        for (let a = 0; a < this._range; a++) {
            for (let b = 0; b < this._range; b++) {
                matrix[a][b] = this._idsMatrix[a][b];
            }
        }
        return matrix;
    }

    // remember: Point(x,y) => x - col, y - row
    private isDotValid(matrix, dotToCheck, id): boolean {
        if ((dotToCheck.x > 0 && dotToCheck.x < 7) && // not on first or last col
            (dotToCheck.y > 0 && dotToCheck.y < 7) && // not on first or last row
            (matrix[dotToCheck.y][dotToCheck.x] != id) &&
            (matrix[dotToCheck.y][dotToCheck.x] < 5)) // not marked as prize or badArea
            return true;
        else 
            return false; 
    }

    private isDotValidNoEdgeCheck(matrix, dotToCheck, id): boolean {
        if ((dotToCheck.x >= 0 && dotToCheck.x <= 7) && // valid col
            (dotToCheck.y >= 0 && dotToCheck.y <= 7) && // valid row
            (matrix[dotToCheck.y][dotToCheck.x] != id) &&
            (matrix[dotToCheck.y][dotToCheck.x] < 5)) // not marked as prize or badArea
            return true;
        else 
            return false; 
    }

    private getArrayOfPointsToCheck(matrix, i, j, id): Array<Point> {
        let array = [];

        let dotToCheck: Point; // remember: Point(x,y) => x - col, y - row

        // checking top left varint
        //  *00
        //  010
        //  000
        dotToCheck = new Point(j-1,i-1);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking top varint
        //  0*0
        //  010
        //  000
        dotToCheck = new Point(j,i-1);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking top right varint
        //  00*
        //  010
        //  000
        dotToCheck = new Point(j+1,i-1);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking right varint
        //  000
        //  01*
        //  000
        dotToCheck = new Point(j+1,i);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking bottom right varint
        //  000
        //  010
        //  00*
        dotToCheck = new Point(j+1,i+1);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking bottom varint
        //  000
        //  010
        //  0*0
        dotToCheck = new Point(j,i+1);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking bottom left varint
        //  000
        //  010
        //  *00
        dotToCheck = new Point(j-1,i+1);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        // checking left varint
        //  000
        //  *10
        //  000
        dotToCheck = new Point(j-1,i);
        if (this.isDotValid(matrix, dotToCheck,id)) {
            array.push(dotToCheck);
        }

        return array;
    }

    private checkArea(i, j: number, id: number): void {
        let matrix = this.getGameMatrixCopy();

        let checkArray = this.getArrayOfPointsToCheck(matrix, i, j, id); 

        const stack = [];


    /*
    1. Поместить затравочный пиксел в стек;
    2. Извлечь пиксел из стека;
    3. Присвоить пикселу требуемое значение (цвет внутренней области);
    4. Каждый окрестный пиксел добавить в стек, если он
    4.1. Не является граничным;
    4.2. Не обработан ранее (т.е. его цвет отличается от цвета границы или цвета внутренней области);
    5. Если стек не пуст, перейти к шагу 2

    */
        let isBadArea: boolean;
        let curAreaDots: Array<Point>;
        checkArray.forEach(startDot => {
            // dot mastnot be marked as prize (val=5) or badArea (val = 6)
            if (matrix[startDot.y][startDot.x] < 5) { 
                isBadArea = false; 
                curAreaDots = [];

                // based on flood filling algorithm 
                stack.push(startDot);
                while (stack.length > 0) {
                    let curDot = stack.pop();

                    matrix[curDot.y][curDot.x] = 5;
                    curAreaDots.push(curDot);

                    // if on edge => badArea
                    if (!isBadArea && (curDot.y == 0 || curDot.y == 7 || curDot.x == 0 || curDot.x == 7)) {
                        isBadArea = true;
                    }

                    // adding around dots
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            let dotToAdd = new Point(curDot.x+j,curDot.y+i);
                            if (this.isDotValidNoEdgeCheck(matrix, dotToAdd, id)) {
                                stack.push(dotToAdd);
                            }
                        }
                    }
                }

                // after finishing area by current startingDot
                // filling it with badArea (val = 6) (if it is bad)
                // or filling with player id
                console.log(this._idsMatrix);
                let fillVal = isBadArea ? 6 : id;
                while (curAreaDots.length>0) {
                    let dotToColor = curAreaDots.pop();
                    matrix[dotToColor.y][dotToColor.x] = fillVal;
                    if (!isBadArea) this._idsMatrix[dotToColor.y][dotToColor.x] = id;
                }
                console.log(matrix);
            }

            console.log(matrix);
        });

        console.log(matrix);
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