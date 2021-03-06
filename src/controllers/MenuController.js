'use strict';

import Controller from './Controller';
import MenuView from '../views/MenuView';

class MenuController extends Controller {
    /**
     * Creates instance of MenuController
     */
    constructor() {
        super();
        this.MenuView = new MenuView();
        this.addActions();
    }

    /**
     * Add actions to controller.
     */
    addActions() {
        this.addAction('index', this.actionIndex);
    }

    /**
     * Default action. Renders menu.
     */
    actionIndex() {
        const data = {
            'Menu': {
                menuItems: [
                    { link:'/lobby', text:'PLAY' },
                    { link:'/scores/show', text:'SCORES' },
                    { link:'/rules', text:'RULES' },
                    { link:'/about', text:'DEVELOPERS' }
                ]
            },
            'Header': this.getHeaderData()
        };
        this.MenuView.constructPage(data);
    }
}

export default MenuController;
