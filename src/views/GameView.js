'use strict';
import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import SceneTemplate from '../ui/templates/scene/';
import GOTemplate from '../ui/templates/gameover/';

class GameView extends View {
    constructor() {
        super();
    }

    constructPage() {
        this._data = {
            'Scene': {
                main: this.getBlock('main')
            }
        };

        return this.onLoad([
            ['Scene', SceneTemplate, { block: 'main'}],
            ['Header', HeaderTemplate, { appendFirst: true }]
        ])
            .then(() => {
                this.showPage();
                SceneTemplate.setSize(this.load('Scene'), this.getBlock('main'));
            });
    }

    constructGameOver() {
        return this.onLoad([
            ['GameOver', GOTemplate, { block: 'modal' }],
            ['Header', HeaderTemplate, { appendFirst: true }]
        ]);
    }

    showGameOver() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('GameOver');
    }

    getScene() {
        return SceneTemplate.getScene(this.load('Scene'));
    }

    getMetaBlock() {
        return SceneTemplate.getMetaBlock(this.load('Scene'));
    }

    getGameOverBlock() {
        return this.load('GameOver');
    }

    showPage() {
        this.show('Header');
        HeaderTemplate.showLogo();
        this.show('Scene');
    }
}

export default GameView;