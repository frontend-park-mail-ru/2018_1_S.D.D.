'use strict';
import ServiceManager from './modules/ServiceManager';
import ErrorController from './controllers/ErrorController';
import MenuController from './controllers/MenuController';
import LoginController from './controllers/LoginController';

const SM = new ServiceManager();

SM.Router.addRoute('error', ErrorController);
SM.Router.addRoute('index', MenuController);
SM.Router.addRoute('', MenuController);
SM.Router.addRoute('login', LoginController);
SM.Router.loadPage();