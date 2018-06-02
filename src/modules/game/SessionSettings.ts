import * as defaultAvatar from './bin/1.svg';

interface IPlayer {
    avatar: string;
    id: number;
    name: string;
}

/**
 * @class
 * @classdesc Current game settingsr.
 */
export default class SessionSettings {
    public static mode: string = 'offline';
    public static lname: string = 'Offline Game';
    public static time: number = 60;
    public static size: number = 8;
    public static players: IPlayer[] = [];
    public static ready: boolean = false;
    public static lobbyId: number = -1;
}
