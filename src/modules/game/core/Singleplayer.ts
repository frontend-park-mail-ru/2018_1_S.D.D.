'use strict';

import Mode from './Mode';
import Player from '../Player';
import Scene from '../SceneService';
import GameField from '../GameField';
import Timer from '../Timer';

export default class SingleplayerMode extends Mode {
    _players: Array<Player>;
    _GameField: GameField;
    _Timer: Timer;

    constructor(scene: Scene) {
        super();
    }
}