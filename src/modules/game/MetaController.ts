import GameEventBus from './GameEventBus';
import Scene from './Scene';

/**
 *
 * @class
 * @classdesc Meta block controller..
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

    public static getTopMarginSize() {
        const block = MetaController.metaBlock;
        const size = block.querySelector('.player').clientHeight;
        MetaController.marginSeparator = size * 1.1;
        [].forEach.call(block.querySelectorAll('.player'), (b: HTMLElement) => {
            b.style.width = `${block.clientWidth * 0.8}px`;
        });
    }

    /**
     * Display table with scores.
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
            this.players.push({
                dom: playerInfoBlock,
                p: player,
            });

            playerInfoBlock.querySelector('.avatar').innerHTML = '';
            playerInfoBlock.querySelector('.avatar').appendChild(player.avatar);

            playerInfoBlock.querySelector('.nickname').innerHTML = player.name;
            const element = playerInfoBlock.querySelector('.nickname') as HTMLElement;
            element.style.color = player.color;
            playerInfoBlock.querySelector('.score').innerHTML = player.score;

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
            player.dom.querySelector('.score').innerHTML = player.p.score;
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
