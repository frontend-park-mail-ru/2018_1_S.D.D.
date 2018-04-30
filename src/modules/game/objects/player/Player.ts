import Character from './Character';

/**
 * Initialize player in the beginning of game.
 * 
 * @class
 * @classdesc Defines behavior for player character.
 */
export default class Player extends Character {
    /**
     * Initializes player in the beginning of game.
     * 
     * @param id Player unique identificator.
     * @param name Player ingame nickname.
     */
    constructor(id: number, name: string) {
        super(id, name);
    }

}