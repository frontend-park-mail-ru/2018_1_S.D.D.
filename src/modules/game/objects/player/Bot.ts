import Character from './Character';

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
     */
    constructor(id: number, name: string) {
        super(id, name);
    }
    
}