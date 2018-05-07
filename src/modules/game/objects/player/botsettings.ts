import * as avatar from '../../bin/1.svg';
import * as ww from '../../bin/ww.png';
import * as jessey from '../../bin/jessey.png';
import * as bill from '../../bin/bill.png';
import * as strange from '../../bin/strange.png';
import * as nobody from '../../bin/nobody.png';
import * as cheater from '../../bin/cheater.png';
import * as admin from '../../bin/admin.png';
import * as crash from '../../bin/crash.png';
import * as gopher from '../../bin/gopher.png';
import * as java from '../../bin/java.png';
import * as superman from '../../bin/superman.png';
import * as willy from '../../bin/willy.png';
import * as homer from '../../bin/homer.png';
import * as pinky from '../../bin/pinky.png';
import * as joey from '../../bin/joey.png';
import * as panther from '../../bin/panther.png';
import * as jon from '../../bin/jon.png';

export const BOTNAMES_MAP = new Map<number, string>([
    [1, 'Reserved by player'], // Reserved by player
    [2, 'W. White'],
    [3, 'Jessey Pinkman'],
    [4, 'Bill Gates'],
    [5, 'Dr. Strange'],
    [6, 'Mr. Nobody'],
    [7, 'Cheater'],
    [8, 'Admin'],
    [9, 'Crash Bandicoot'],
    [10, 'Gopher'],
    [11, 'ILoveJava ❤'],
    [12, 'SuperMan'],
    [13, 'Willy Wonka'],
    [14, 'Homer Simpson'],
    [15, 'Pinky'],
    [16, 'Joey Tribbiani'],
    [17, '#000000 Panther'],
    [18, 'Jon Snow'],
]);

// later we can add custom avatars for each nickname
export const BOTAVATARS_MAP = new Map<number, string>([
    [1, avatar], // Reserved by player
    [2, ww],
    [3, jessey],
    [4, bill],
    [5, strange],
    [6, nobody],
    [7, cheater],
    [8, admin],
    [9, crash],
    [10, gopher],
    [11, java],
    [12, superman],
    [13, willy],
    [14, homer],
    [15, pinky],
    [16, joey],
    [17, panther],
    [18, jon],
]);
