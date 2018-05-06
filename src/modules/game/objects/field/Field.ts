import Composite from '../Composite';
import Cell from './Cell';
import Scene from '../../Scene';
import { DEFAULT_FIELD_RANGE } from '../../settings';
import GameEventBus from '../../GameEventBus';
import Point from '../Point';

/**
 * Initialize field.
 * 
 * @class
 * @classdesc Game field.
 */
export default class Field {
    /**
     * Field size: Range X Range.
     */
    public static range: number;

    /**
     * Cell's matrix.
     */
    public cellsMatrix: Array<Array<Cell>>;

    /**
     * Initialize field.
     * 
     * @param range Field size: Range X Range.
     */
    constructor(range: number = DEFAULT_FIELD_RANGE) {
        Field.range = range;
        this.subscribeStep();
    }

    /**
     * Destroy current instance of field.
     * 
     * @returns Null.
     */
    public destroy(): null {
        this.cellsMatrix = null;
        return null;
    }

    /**
     * Initialize field. Creates cells objects.
     */
    public initField(): void {
        if (!Scene.Field) {
            Scene.Field = new Composite();
        }

        this.cellsMatrix = [];
        for (let y = 0; y < Field.range; y++) {
            this.cellsMatrix[y] = [];
            for (let x = 0; x < Field.range; x++) {
                const FieldCell = new Cell(new Point(x, y));
                this.cellsMatrix[y][x] = FieldCell;
                Scene.Field.add(FieldCell);
            }
        }
    }

    /**
     * After stepping on cell we need mark this cell.
     */
    private subscribeStep(): void {
        GameEventBus.subscribe('STEPPED', (id, position) => { this.markCell(position, id); }, this);
    }

    /**
     * Mark Cell into player ID.
     * 
     * @param poistion X, Y position on field.
     * @param id Player ID
     */
    private markCell(position: Point, id: number): void {
        // if last player's step was rounded area, 
        // it should be visible 1 more step
        if (Scene.Players.item(player => player.id == id) && Scene.Players.item(player => player.id == id).gotScore) {
            this.countScoresForPlayer(id);
            Scene.Players.item(player => player.id == id).gotScore = false;
        }

        if (this.cellsMatrix[position.y][position.x].player != id) {
            this.cellsMatrix[position.y][position.x].player = id;
            this.cellsMatrix[position.y][position.x].bad = false;
            this.cellsMatrix[position.y][position.x].scored = false;
        } else {
            this.checkArea(position, id);
        }
    }

    /**
     * Count number of cells owned by a player.
     * 
     * @param id Player id which had scored.
     * @return Number of cells owned by a player.
     */
    private countScoresForPlayer(id:  number): number {
        let score: number = 0;

        for (let i = 0; i < Field.range; i++) {
            for (let j = 0; j < Field.range; j++) {
                if (this.cellsMatrix[i][j].player == id) {
                    score++;
                    this.cellsMatrix[i][j].player = 0;
                }
            }
        }

        GameEventBus.emit(`SCORE:${id}`, score);

        return score;
    }

    /**
     * Check if dot is valid for seeding algorithm. Without cheking edge.
     * 
     * @param cells Game field.
     * @param pointToCheck Point to check position.
     * @param id Player id.
     */
    private isDotValidNoEdgeCheck(cells: Array<Array<Cell>>, pointToCheck: Point, id: number): boolean {
        return (
            (pointToCheck.x >= 0 && pointToCheck.x <= Field.range - 1) && // not on first or last col
            (pointToCheck.y >= 0 && pointToCheck.y <= Field.range - 1) && // not on first or last row
            (cells[pointToCheck.y][pointToCheck.x].player != id) && // current player is not owner of cell
            (!cells[pointToCheck.y][pointToCheck.x].scored) && // not marked as scored
            (!cells[pointToCheck.y][pointToCheck.x].bad) // not marked as bad area
        );
    }

    /**
     * Check if dot is valid for seeding algorithm.
     * 
     * @param cells Game field.
     * @param pointToCheck Point to check position.
     * @param id Player id.
     */
    private isPointValid(cells: Array<Array<Cell>>, pointToCheck: Point, id: number): boolean {
        return (
            (pointToCheck.x > 0 && pointToCheck.x < Field.range - 1) && // not on first or last col
            (pointToCheck.y > 0 && pointToCheck.y < Field.range - 1) && // not on first or last row
            (cells[pointToCheck.y][pointToCheck.x].player != id) && // current player is not owner of cell
            (!cells[pointToCheck.y][pointToCheck.x].scored) && // not marked as scored
            (!cells[pointToCheck.y][pointToCheck.x].bad) // not marked as bad area
        );
    }

    /**
     * Get start points for seeding algorithm.
     * 
     * @param cells Game field.
     * @param position Point poistion.
     * @param id Player id.
     */
    private getArrayOfPointsToCheck(cells: Array<Array<Cell>>, position: Point, id: number): Array<Point> {
        let pointsToCheck: Array<Point> = [];

        for (let x = position.x - 1; x <= position.x + 1; x++) {
            console.log(x)
            for (let y = position.y - 1; y <= position.y + 1; y++) {
                if (x != position.x && y != position.y) {
                    const pointToCheck = new Point(x, y);
                    if (this.isPointValid(cells, pointToCheck, id)) {
                        pointsToCheck.push(pointToCheck);
                    }
                }
            }
        }
        console.log('-----')

        return pointsToCheck;
    }

    /**
     * Check if we got rounded area.
     * 
     * @param position Last player step.
     * @param id Player id.
     */
    private checkArea(position: Point, id:number): void {
        this.cellsMatrix.forEach((row,i) => {
            console.log(i, row[0].player,row[1].player,row[2].player,row[3].player,row[4].player,row[5].player,row[6].player,row[7].player,)
        })
        console.log('-----------')

        let cells: Array<Array<Cell>> = this.cellsMatrix.map(col => Object.assign([], col));
        let checkArray = this.getArrayOfPointsToCheck(cells, position, id); 

        const stack: Array<Point> = [];

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
            // dot mastnot be marked as scored or badArea
            if (!cells[startDot.y][startDot.x].scored && !cells[startDot.y][startDot.x].bad) { 
                isBadArea = false; 
                curAreaDots = [];

                // based on flood filling algorithm 
                stack.push(startDot);
                while (stack.length > 0) {
                    let curDot = stack.pop();

                    cells[curDot.y][curDot.x].scored = true;
                    curAreaDots.push(curDot);

                    // if on edge => badArea
                    if (!isBadArea && (curDot.y == 0 || curDot.y == Field.range - 1 || curDot.x == 0 || curDot.x == Field.range - 1)) {
                        isBadArea = true;
                    }

                    // adding around dots
                    for (let x = curDot.x - 1; x < curDot.x + 1; x++) {
                        for (let y = curDot.y - 1; y < curDot.y + 1; y++) {
                            let dotToAdd = new Point(x, y);
                            if (this.isDotValidNoEdgeCheck(cells, dotToAdd, id)) {
                                stack.push(dotToAdd);
                            }
                        }
                    }
                }

                // mark that player can get score on next step
                if (!Scene.Players.item(player => player.id == id).gotScore && !isBadArea) {
                    Scene.Players.item(player => player.id == id).gotScore = true;
                }

                // after finishing area by current startingDot
                // filling it with badArea
                // or filling with player id
                while (curAreaDots.length > 0) {
                    let dotToColor = curAreaDots.pop();
                    if (isBadArea) {
                        cells[dotToColor.y][dotToColor.x].bad = true;
                    } else {
                        cells[dotToColor.y][dotToColor.x].player = id;
                        cells[dotToColor.y][dotToColor.x].bad = false;
                        cells[dotToColor.y][dotToColor.x].scored = false;
                    }
                    if (!isBadArea) {
                        this.cellsMatrix[dotToColor.y][dotToColor.x].player = id;
                        this.cellsMatrix[dotToColor.y][dotToColor.x].bad = false;
                        this.cellsMatrix[dotToColor.y][dotToColor.x].scored = false;
                    }
                }
            }
        });
    }


}