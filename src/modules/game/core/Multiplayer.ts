'use strict';

import IMode from './IMode';
import Player from './Player';
import GameField from './GameField';
import Timer from './Timer';
import InitialPlayerData from './InitialPlayerData';

export default class MultiplayerMode implements IMode {
    readonly _players: Array<Player>;
    readonly _GameField: GameField;
    readonly _Timer: Timer;
    gameFieldRange: number;
}