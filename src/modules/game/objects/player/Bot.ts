import Character from './Character';
import Point from '../Point';

/**
 * Initialize bot in the beginning of game.
 * 
 * @class
 * @classdesc Defines behavior for bot character.
 */
export default class Bot extends Character {
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
    
}