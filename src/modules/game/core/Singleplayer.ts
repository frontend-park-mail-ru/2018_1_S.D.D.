'use strict';

import IMode from './IMode';
import Player from './Player';
import GameField from './GameField';
import Timer from './Timer';

export default class SingleplayerMode implements IMode {
    _players: Array<Player>;
    _GameField: GameField;
    _Timer: Timer;
}