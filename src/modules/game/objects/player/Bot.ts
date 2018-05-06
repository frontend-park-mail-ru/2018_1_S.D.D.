import Point from '../Point';
import Character from './Character';
import { Direction } from './directions';

/**
 * Initialize bot in the beginning of game.
 *
 * @class
 * @classdesc Defines behavior for bot character.
 */
export default class Bot extends Character {
    /**
     * Count to stay on course.
     */
    private stayOnCourseCount: number = 0;
    /**
     * Initializes bot in the beginning of game.
     *
     * @param id Bot unique identificator.
     * @param name Bot ingame nickname.
     * @param startPosition Defines on which cell bot spawns.
     */
    constructor(id: number, name: string, startPosition: Point) {
        super(id, name, startPosition);
    }

    /**
     * Switch randomly directions of movement.
     */
    public switchDirection(): void {
        const directionKeys = Object.keys(Direction).filter((k) => typeof Direction[k as any] === 'number');
        const directionValues = directionKeys.map((k) => parseInt(Direction[k as any], 10));
        const max = Math.max.apply(null, directionValues);
        const min = Math.min.apply(null, directionValues);

        if (this.stayOnCourseCount === 0) {
            this.moveOffset.x = 0;
            this.moveOffset.y = 0;
            this.direction = Math.floor(Math.random() * max) + min;
            this.stayOnCourseCount = Math.floor(Math.random() * 4) + 2;
        }

        this.stayOnCourseCount--;
    }

}
