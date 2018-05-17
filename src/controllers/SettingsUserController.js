'use strict';

import Controller from './Controller';
import UserModel from '../models/UserModel';
import SettingsUserView from '../views/SettingsUserView';
import validation from '../modules/validations';

class SettingsUserController extends Controller {
    /**
     * Creates instance of SettingsUserController
     */
    constructor() {
        super();
        if (SettingsUserController.__instance) {
            return SettingsUserController.__instance;
        }
        SettingsUserController.__instance = this;

        this.UserModel = new UserModel();
        this.UserView = new SettingsUserView();
    }

    /**
     * Defines forms reload actions after users data changes.
     */
    subscribeSettingsActions() {
        const EventBus = this.ServiceManager.EventBus;

        const nicknameChangedOff = EventBus.subscribe('nicknameChanged', () => {
            const data = this._getSettingsData();
            this.UserView.reloadForm('EditNickname', data);
        }, this);
        EventBus.subscribe('logout', nicknameChangedOff, this, true);

        const avatarChangedOff = EventBus.subscribe('avatarChanged', () => {
            const data = this._getSettingsData();
            this.UserView.reloadAvatar(data);
        }, this);
        EventBus.subscribe('logout', avatarChangedOff, this, true);

        const emailChangedOff = EventBus.subscribe('emailChanged', () => {
            const data = this._getSettingsData();
            this.UserView.reloadForm('EditEmail', data);
        }, this);
        EventBus.subscribe('logout', emailChangedOff, this, true);

        const passwordChangedOff = EventBus.subscribe('passwordChanged', () => {
            const data = this._getSettingsData();
            this.UserView.reloadForm('EditPassword', data);
        }, this);
        EventBus.subscribe('logout', passwordChangedOff, this, true);

        EventBus.subscribe('logout', () => {
            this.UserView.destroySettings();
            this.subscribed = false;
        }, this);

        this.subscribed = true;
    }

    /**
     * Show form with user`s settings
     */
    actionIndex() {
        if (!this.subscribed) {
            this.subscribeSettingsActions();
        }

        const data = this._getSettingsData();
        this.UserView.constructSettings(data);
    }

    /**
     * Upload users avatar.
     */
    actionUploadAvatar() {
        let submitData = this.UserView.serializeAvatar();
        if (!submitData) {
            const data = this._getSettingsData();
            this.UserView.constructPage(data);
            submitData = this.UserView.serializeAvatar();
        }

        const EventBus = this.ServiceManager.EventBus;
        if (!EventBus.eventExists('avatarUploadingError')) {
            EventBus.subscribe('avatarUploadingError', errors => {
                for (let e in errors) {
                    this.UserView.addFormError('UploadAvatar', e, errors[e]);
                }
            }, this);
        }

        this.UserModel.uploadAvatar(submitData);
    }

    /**
     * Submit action. Edit user settings. Validate form and submit data to server if ok.
     * 
     * @param {string} editParam Contains what to edit
     */
    actionEdit(editParam) {
        if (!editParam || editParam === '') {
            this.go('/error/404', false);
            return;
        }
        
        let formTemplate = '';
        switch (editParam) {
        case 'nickname':
            formTemplate = 'EditNickname';
            break;
        case 'email':
            formTemplate = 'EditEmail';
            break;
        case 'password':
            formTemplate =  'EditPassword';
            break;
        default:
            this.go('/error/404', false);
            return;
        }

        let submitData = this.UserView.serializeForm(formTemplate);
        if (!submitData) {
            const data = this._getSettingsData();
            this.UserView.constructSettings(data);
            submitData = this.UserView.serializeForm(formTemplate);
        }
        
        const EventBus = this.ServiceManager.EventBus;
        if (!EventBus.eventExists(`edit${editParam}Error`)) {
            EventBus.subscribe(`edit${editParam}Error`, errors => {
                for (let e in errors) {
                    this.UserView.addFormError(formTemplate, e, errors[e]);
                }
                this.go('/user/settings');
            }, this);
        }
        
        switch (editParam) {
        case 'nickname':
            this.UserModel.editNickname(submitData);
            break;
        case 'email':
            this.UserModel.editEmail(submitData);
            break;
        case 'password':
            this.UserModel.editPassword(submitData);
            break;
        }
    }

    /**
     * Get data for settings page rendering.
     * 
     * @returns {Object} Data for rendering.
     */
    _getSettingsData() {
        return {
            'Header': this.getHeaderData(),
            'EditNickname': this.getEditNickname(),
            'EditEmail': this.getEditEmail(),
            'EditPassword': this.getEditPassword(),
            'UploadAvatar': this.getUploadAvatar(),
            'Avatar': this.getAvatar()
        };
    }

    /**
     * If user uploaded avatar will contain path to this avatar.
     * 
     * @returns {Object} Contains flag of default avatar and path to users avatar.
     */
    getAvatar() {
        const UserStorage = this.ServiceManager.UserStorage;
        return {
            defaultAvatar: UserStorage.getData('avatar') === 'null',
            avatar: UserStorage.getData('avatar'),
        };
    }

    /**
     * Get data for rendering nickname form.
     * 
     * @returns {Object} Contains data for template rendering.
     */
    getEditNickname() {
        const UserStorage = this.ServiceManager.UserStorage;
        return {
            back: true,
            header: false,
            social: false,
            formAction: '/user/edit/nickname',
            onSubmit: () => this.go('/user/edit/nickname', false),
            formInputs: [
                {
                    type: 'text',
                    name: 'nickname',
                    placeholder: UserStorage.getData('nickname'),
                    validateMethod: validation.login,
                    validateFields: ['nickname']
                }
            ],
            button: 'CHANGE NICKNAME'
        };
    }

    /**
     * Get data for rendering email form.
     * 
     * @returns {Object} Contains data for template rendering.
     */
    getEditEmail() {
        const UserStorage = this.ServiceManager.UserStorage;
        return {
            header: false,
            social: false,
            formAction: '/user/edit/email',
            onSubmit: () => this.go('/user/edit/email', false),
            formInputs: [
                {
                    type: 'text',
                    name: 'email',
                    placeholder: UserStorage.getData('email'),
                    validateMethod: validation.email,
                    validateFields: ['email']
                }
            ],
            button: 'CHANGE EMAIL'
        };
    }

    /**
     * Get data for rendering password form.
     * 
     * @returns {Object} Contains data for template rendering.
     */
    getEditPassword() {
        return {
            header: false,
            social: false,
            formAction: '/user/edit/password',
            onSubmit: () => this.go('/user/edit/password', false),
            formInputs: [
                {
                    type: 'password',
                    name: 'oldPassword',
                    placeholder: 'Old password',
                    validateMethod: validation.password,
                    validateFields: ['oldPassword']
                },
                {
                    type: 'password',
                    name: 'password',
                    placeholder: 'New password',
                    validateMethod: validation.password,
                    validateFields: ['password', 'passwordCheck']
                },
                {
                    type: 'password',
                    name: 'passwordCheck',
                    placeholder: 'Confirm password',
                    validateMethod: validation.password,
                    validateFields: ['passwordCheck', 'password']
                }
            ],
            button: 'CHANGE PASSWORD'
        };
    }

    /**
     * Get data for rendering avatar form.
     * 
     * @returns {Object} Contains data for template rendering.
     */
    getUploadAvatar() {
        return {
            header: false,
            social: false,
            formAction: '/user/uploadavatar',
            onSubmit: () => this.go('/user/uploadavatar', false),
            formInputs: [
                {
                    type: 'file',
                    name: 'file',
                    placeholder: 'Photo upload'
                }
            ],
            button: 'UPLOAD PHOTO'
        };
    }
}

export default SettingsUserController;
