import GameEventBus from '../../GameEventBus';
import Scene from '../../Scene';
import SessionSettings from '../../SessionSettings';
import { DEFAULT_FIELD_RANGE } from '../../settings';
import Composite from '../Composite';
import Point from '../Point';
import Cell from './Cell';

interface IFieldState {
    field: number[][];
}

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
    public cellsMatrix: Cell[][];

    /**
     * Initialize field.
     *
     * @param range Field size: Range X Range.
     */
    constructor(range: number = SessionSettings.size) {
        Field.range = range;
        this.subscribeStep();
    }

    /**
     * Destroy current instance of field.
     *
     * @returns True.
     */
    public destroy(): boolean {
        this.cellsMatrix = null;
        return true;
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
     * Fill field with new values
     *
     * @param field Field state.
     */
    public fillField(field: IFieldState) {
        field.field.forEach((row, y) => {
            row.forEach((playerId, x) => {
                this.cellsMatrix[y][x].player = playerId;
            });
        });
    }

    /**
     * Mark Cell into player ID.
     *
     * @param poistion X, Y position on field.
     * @param id Player ID
     * @param prevPosition Position form which player stepped on this cell.
     */
    public markCell(position: Point, id: number, prevPosition?: Point): void {
        // if last player's step was rounded area,
        // it should be visible 1 more step
        if (Scene.Players.item((player) => player.id === id) &&
            Scene.Players.item((player) => player.id === id).gotScore) {
            this.countScoresForPlayer(id);
            Scene.Players.item((player) => player.id === id).gotScore = false;
        }

        if (this.cellsMatrix[position.y][position.x].player !== id) {
            this.cellsMatrix[position.y][position.x].player = id;
            this.cellsMatrix[position.y][position.x].bad = false;
            this.cellsMatrix[position.y][position.x].scored = false;
        }
        if (prevPosition) {
            this.checkNeighborCell(position, prevPosition, id).forEach((cell) => {
                this.checkArea(cell, id);
            });
        }
    }

    /**
     * After stepping on cell we need mark this cell.
     */
    private subscribeStep(): void {
        GameEventBus.subscribe('STEPPED', (id, position, prevPosition?) => {
            this.markCell(position, id, prevPosition);
        }, this);
    }

    /**
     * Check if neighbor cells marked for current player.
     *
     * @param position Player current position.
     * @param prevPosition Player previous position.
     * @param id Player id.
     */
    private checkNeighborCell(position: Point, prevPosition: Point, id: number): Point[] {
        const checkedCells: Point[] = [];
        const checkPosition = new Point(position.x, position.y);
        const c = this.cellsMatrix;
        const check = (x, y) => {
            if (c[y] && c[y][x] && c[y][x].player === id && (x !== prevPosition.x || y !== prevPosition.y)) {
                checkedCells.push(new Point(x, y));
            }
        };

        check(checkPosition.x + 1, checkPosition.y);
        check(checkPosition.x, checkPosition.y + 1);
        check(checkPosition.x - 1, checkPosition.y);
        check(checkPosition.x, checkPosition.y - 1);

        return checkedCells;
    }

    /**
     * Count number of cells owned by a player.
     *
     * @param id Player id which had scored.
     * @return Number of cells owned by a player.
     */
    private countScoresForPlayer(id: number): number {
        let score: number = 0;

        for (let i = 0; i < Field.range; i++) {
            for (let j = 0; j < Field.range; j++) {
                if (this.cellsMatrix[i][j].player === id) {
                    score++;
                    this.cellsMatrix[i][j].player = 0;
                    this.cellsMatrix[i][j].scored = false;
                    this.cellsMatrix[i][j].bad = false;
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
    private isDotValidNoEdgeCheck(cells: Cell[][], pointToCheck: Point, id: number): boolean {
        return (
            (pointToCheck.x >= 0 && pointToCheck.x <= Field.range - 1) && // not on first or last col
            (pointToCheck.y >= 0 && pointToCheck.y <= Field.range - 1) && // not on first or last row
            (cells[pointToCheck.y][pointToCheck.x].player !== id) && // current player is not owner of cell
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
    private isPointValid(cells: Cell[][], pointToCheck: Point, id: number): boolean {
        return (
            (pointToCheck.x > 0 && pointToCheck.x < Field.range - 1) && // not on first or last col
            (pointToCheck.y > 0 && pointToCheck.y < Field.range - 1) && // not on first or last row
            (cells[pointToCheck.y][pointToCheck.x].player !== id) && // current player is not owner of cell
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
    private getArrayOfPointsToCheck(cells: Cell[][], position: Point, id: number): Point[] {
        const pointsToCheck: Point[] = [];

        for (let x = position.x - 1; x <= position.x + 1; x++) {
            for (let y = position.y - 1; y <= position.y + 1; y++) {
                if (x !== position.x || y !== position.y) {
                    const pointToCheck = new Point(x, y);
                    if (this.isPointValid(cells, pointToCheck, id)) {
                        pointsToCheck.push(pointToCheck);
                    }
                }
            }
        }

        return pointsToCheck;
    }

    /**
     * Check if we got rounded area.
     *
     * @param position Last player step.
     * @param id Player id.
     */
    private checkArea(position: Point, id: number): void {
        const cells = [];
        this.cellsMatrix.forEach((col, i) => {
            cells[i] = [];
            col.forEach((cell, j) => {
                cells[i][j] = {...cell};
            });
        });

        const checkArray = this.getArrayOfPointsToCheck(cells, position, id);
        const stack: Point[] = [];

        /*
        1. Поместить затравочный пиксел в стек;
        2. Извлечь пиксел из стека;
        3. Присвоить пикселу требуемое значение (цвет внутренней области);
        4. Каждый окрестный пиксел добавить в стек, если он
        4.1. Не является граничным;
        4.2. Не обработан ранее (т.е. его цвет отличается от цвета границы или цвета внутренней области);
        5. Если стек не пуст, перейти к шагу 2
        */
        let isBadArea: boolean = false;
        let curAreaDots: Point[] = [];

        checkArray.forEach((startDot) => {
            // dot mastnot be marked as scored or badArea
            if (!cells[startDot.y][startDot.x].scored && !cells[startDot.y][startDot.x].bad) {
                isBadArea = false;
                curAreaDots = [];

                // based on flood filling algorithm
                stack.push(startDot);
                while (stack.length > 0) {
                    const curDot = stack.pop();

                    cells[curDot.y][curDot.x].player = 0;
                    cells[curDot.y][curDot.x].scored = true;
                    cells[curDot.y][curDot.x].bad = false;
                    curAreaDots.push(curDot);

                    // if on edge => badArea
                    if (!isBadArea && (
                        curDot.y === 0 ||
                        curDot.y === Field.range - 1 ||
                        curDot.x === 0 ||
                        curDot.x === Field.range - 1)) {
                        isBadArea = true;
                    }

                    // adding around dots
                    for (let y = curDot.y - 1; y <= curDot.y + 1; y++) {
                        for (let x = curDot.x - 1; x <= curDot.x + 1; x++) {
                            const dotToAdd = new Point(x, y);
                            if (this.isDotValidNoEdgeCheck(cells, dotToAdd, id)) {
                                stack.push(dotToAdd);
                            }
                        }
                    }
                }

                // mark that player can get score on next step
                if (!Scene.Players.item((player) => player.id === id).gotScore && !isBadArea) {
                    Scene.Players.item((player) => player.id === id).gotScore = true;
                }

                // after finishing area by current startingDot
                // filling it with badArea
                // or filling with player id
                while (curAreaDots.length > 0) {
                    const dotToColor = curAreaDots.pop();
                    if (isBadArea) {
                        cells[dotToColor.y][dotToColor.x].player = 0;
                        cells[dotToColor.y][dotToColor.x].bad = true;
                        cells[dotToColor.y][dotToColor.x].scored = false;
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
