'use strict';

import ServiceManager from './modules/ServiceManager';
import ErrorController from './controllers/ErrorController';
import MenuController from './controllers/MenuController';
import LoginController from './controllers/LoginController';
import SignupController from './controllers/SignupController';
import ScoresController from './controllers/ScoresController';
import UserController from './controllers/UserController';
import AboutController from './controllers/AboutController';
import GameController from './controllers/GameController';
import LobbyController from './controllers/LobbyController';

const SM = new ServiceManager();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .catch(() => {});
}

SM.Router.addRoute('error', ErrorController);
SM.Router.addRoute('index', MenuController);
SM.Router.addRoute('', MenuController);
SM.Router.addRoute('login', LoginController);
SM.Router.addRoute('signup', SignupController);
SM.Router.addRoute('scores', ScoresController);
SM.Router.addRoute('user', UserController);
SM.Router.addRoute('about', AboutController);
SM.Router.addRoute('play', GameController);
SM.Router.addRoute('lobby', LobbyController);

// Check for user logged in and then load current page
SM.Router.go('/user', false);

