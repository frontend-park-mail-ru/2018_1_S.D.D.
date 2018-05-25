'use strict';

import Controller from './Controller';
import GameView from '../views/GameView';
import Game from '../modules/game';
import SessionSettings from '../modules/game/SessionSettings';

class GameController extends Controller {
    constructor () {
        super();
        if (GameController.__instance) {
            return GameController.__instance;
        }        
        GameController.__instance = this;

        this.GameView = new GameView();
        this.addActions();
        this.subscribeEvents();
    }

    addActions() {
        this.addAction('index', this.actionIndex);
    }

    subscribeEvents() {
    }

    actionIndex(room) {
        this.GameView.constructPage()
            .then(() => {
                if (this.GameManager) {
                    this.GameManager = this.GameManager.destroy();
                }
                if (SessionSettings.players.length === 0) {
                    this.ServiceManager.Router.re('/lobby');
                    return;
                }
                this.GameManager = new Game(room, this.GameView);
            });
    }

    onPageLeave() {
        if (this.GameManager) {
            this.GameManager = this.GameManager.destroy();
        }
    }
    
}

export default GameController;