'use strict';
import ServiceManager from './modules/ServiceManager';
import ErrorController from './controllers/ErrorController';
import MenuController from './controllers/MenuController';
import LoginController from './controllers/LoginController';
import SignupController from './controllers/SignupController';
import UserController from './controllers/UserController';

const SM = new ServiceManager();

SM.Router.addRoute('error', ErrorController);
SM.Router.addRoute('index', MenuController);
SM.Router.addRoute('', MenuController);
SM.Router.addRoute('login', LoginController);
SM.Router.addRoute('signup', SignupController);
SM.Router.addRoute('user', UserController);

SM.User.loadUser()
	.then(() => {
		SM.Router.loadPage();
	})
	.catch(() => {
		SM.Router.go('/error/503', false);
	});