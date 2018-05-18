import GameEventBus from './GameEventBus';
import Character from './objects/player/Character';
import Scene from './Scene';

/**
 * Mnogo govnokoda. Sorry.
 */

/**
 *
 * @class
 * @classdesc Meta block and modal screen controller.
 */
export default class MetaController {

    public static players: any[];
    public static marginSeparator: number;

    /**
     * Sets timer value on meta block.
     *
     * @param timer Timer value.
     */
    public static updateTimer(timer: number): void {
        const timerBlock = MetaController.metaBlock.querySelector('.timer');
        timerBlock.innerHTML = `${timer} seconds left!`;
    }

    /**
     * Margins of player-line-block.
     */
    public static getTopMarginSize() {
        const block = MetaController.metaBlock;
        const size = block.querySelector('.sc_player').clientHeight;
        MetaController.marginSeparator = size * 1.1;
        [].forEach.call(block.querySelectorAll('.sc_player'), (b: HTMLElement) => {
            b.style.width = `${block.clientWidth * 0.8}px`;
        });
    }

    /**
     * Display ingame table with scores.
     *
     * @param players Players to display.Contains nicknames, avatars and ids.
     */
    public static initPlayersScores(players: any[]): void {
        MetaController.getTopMarginSize();
        window.addEventListener('resize', () => {
            MetaController.getTopMarginSize();
            MetaController.updateScores();
        });
        window.addEventListener('orientationchange', () => {
            MetaController.getTopMarginSize();
            MetaController.updateScores();
        });

        MetaController.players = [];
        const playersBlock = MetaController.metaBlock.querySelector('.players-scores');
        players.forEach((player, i) => {
            const playerInfoBlock = playersBlock.querySelector(`.game-id-${i + 1}`) as HTMLElement;
            playerInfoBlock.style.top = `${(i + 1) * MetaController.marginSeparator}px`;
            MetaController.players.push({
                dom: playerInfoBlock,
                p: player,
            });

            playerInfoBlock.querySelector('.sc_avatar').innerHTML = '';
            playerInfoBlock.querySelector('.sc_avatar').appendChild(player.avatar);

            playerInfoBlock.querySelector('.sc_nickname').innerHTML = player.name;
            const element = playerInfoBlock.querySelector('.sc_nickname') as HTMLElement;
            element.style.color = player.color;
            playerInfoBlock.querySelector('.sc_score').innerHTML = player.score;

            const hexToRgb = (hex, a = 1) => {
                const bigint = parseInt(hex.substr(1), 16);
                const r = (bigint >> 16) & 255;
                const g = (bigint >> 8) & 255;
                const b = bigint & 255;

                return `rgba(${r},${g},${b},${a})`;
            };

            playerInfoBlock.style.background = hexToRgb(player.color, 0.3);
        });
    }

    public static updateScores(): void {
        MetaController.players.sort((a , b) => {
            return a.p.score < b.p.score ? 1 : -1;
        });

        MetaController.players.forEach((player, i) => {
            player.dom.style.top = `${(i + 1) * MetaController.marginSeparator}px`;
            player.dom.querySelector('.sc_score').innerHTML = player.p.score;
        });
    }

    public static gameover(block: HTMLElement, places: Character[][]): void {
        const win: HTMLElement = block.querySelector('.gameover__result_win');
        const lost: HTMLElement = block.querySelector('.gameover__result_lost');
        const draw: HTMLElement = block.querySelector('.gameover__result_draw');
        win.style.display = lost.style.display = 'none';
        lost.style.display = lost.style.display = 'none';
        draw.style.display = lost.style.display = 'none';

        const createPlayerBlock = (avatar: string, nickname: string, score: number, maxS: number) => {
            const goplayer = document.createElement('div');
            goplayer.classList.add('go_player');

            const crown = document.createElement('div');
            crown.classList.add('crown');
            goplayer.appendChild(crown);

            const goavatar = document.createElement('img');
            goavatar.src = avatar;
            goavatar.classList.add('go_avatar');
            goplayer.appendChild(goavatar);

            const gonickname = document.createElement('div');
            if (nickname.length < maxS) {
                const toAdd = (maxS - nickname.length) / 2;
                const prep = '&nbsp;'.repeat(toAdd);
                nickname = prep + nickname + prep;
            }
            gonickname.innerHTML = nickname;
            gonickname.classList.add('go_nickname');
            goplayer.appendChild(gonickname);

            const goscore = document.createElement('div');
            goscore.innerHTML = score.toString();
            goscore.classList.add('go_score');
            goplayer.appendChild(goscore);

            return goplayer;
        };

        let maxSymbols = 0;
        places.forEach((place) => {
            place.forEach((player) => {
                const n = player.name.length;
                maxSymbols = n > maxSymbols ? n : maxSymbols;
            });
        });

        let placeInDom = block.querySelector(`.gameover__player-1 .players__container`);
        placeInDom.innerHTML = '';
        let placeBlock = block.querySelector(`.gameover__player-1 .go_place`);
        placeBlock.innerHTML = places[0].length === 1 ? 'WINNER' : 'WINNERS';

        placeInDom = block.querySelector(`.gameover__player-2 .players__container`);
        placeInDom.innerHTML = 'Everyone is a champion!';
        placeBlock = block.querySelector(`.gameover__player-2 .go_place`);
        placeBlock.innerHTML = places[0].length === 3 ? 'LOOSER' : 'LOOSERS';

        places.forEach((place, i) => {
            const j = i > 0 ? 2 : 1;
            const goplaceInDom = block.querySelector(`.gameover__player-${j} .players__container`);
            if (goplaceInDom.innerHTML === 'Everyone is a champion!') {
                goplaceInDom.innerHTML = '';
            }
            place.forEach((player) => {
                if (player.isCurrentPlayer) {
                    if (i > 0) {
                        lost.style.display = 'block';
                    } else {
                        if (place.length > 1) {
                            draw.style.display = 'block';
                        } else {
                            win.style.display = 'block';
                        }
                    }
                }
                goplaceInDom.appendChild(
                    createPlayerBlock(player.avatar.src, player.name, player.score, maxSymbols),
                );
            });
        });
    }

    /**
     * Meta block.
     *
     * @returns Meta block.
     */
    public static get metaBlock(): HTMLElement {
        return Scene.sceneMetaBlock;
    }
}
