import * as defaultAvatar from './bin/1.svg';

/**
 * @class
 * @classdesc Current game settingsr.
 */
export default class SessionSettings {
    public static mode: string = 'offline';
    public static lname: string = 'Offline Game';
    public static time: number = 60;
    public static size: number = 8;
    public static players: any[] = [{
        avatar: defaultAvatar,
        id: 1,
        name: 'Mr. Incognito',
    }];
}
