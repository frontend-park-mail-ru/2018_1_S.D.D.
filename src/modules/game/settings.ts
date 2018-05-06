import { Direction } from './objects/player/directions';

export const COLOR_MAP = new Map<number, string>([
    [0, '#FFFFFF'],
    [1, '#FF5A5A'],
    [2, '#FFF15A'],
    [3, '#FFBE3C'],
    [4, '#73DB56'],
]);

export const DIRECTION_MAP = new Map<number, Direction>([
    [1, Direction.RIGHT],
    [2, Direction.DOWN],
    [3, Direction.LEFT],
    [4, Direction.UP],
]);

export const GAME_DURATION = 60;
export const DEFAULT_FIELD_RANGE = 8;
export const CELL_SIZE = 100;

export const CHARACTER_VELOCITY = 0.3;
