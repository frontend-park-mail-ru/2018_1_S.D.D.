'use strict';

import View from './View';
import HeaderTemplate from '../ui/templates/header/';
import LogoTemplate from '../ui/templates/logo/';
import FormTemplate from '../ui/templates/form/';

/**
 * Creates instance of MenuView
 * 
 * @class
 * @classdesc Menu view. Render, shows, hide page.
 */
class LoginView extends View {
	/**
	 * Creates instance of MenuView
	 */
	constructor() {
		super();
	}
    
	constructPage(data = {}) {
		this._data = data;
		this.load('Header', HeaderTemplate, { appendFirst: true });
		this.load('Logo', LogoTemplate, { block: 'left' });
		this.load('LoginForm', FormTemplate, { block: 'right' });
	}

	showPage() {
		this.show('Header');
		this.show('Logo');
		this.show('LoginForm');
	}
}

export default LoginView;
