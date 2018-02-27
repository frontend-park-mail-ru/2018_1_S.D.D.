'use strict';
import ServiceManager from './modules/ServiceManager';
import MenuController from './controllers/MenuController';

const SM = new ServiceManager();
SM.Router.addRoute('/index', MenuController);