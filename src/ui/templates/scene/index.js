'use strict';

import template from './scene.pug';
import './scene.scss';

export default {
    setSize: (template, parent) => {
        const canvas = template.querySelector('.scene');

        const w = template.querySelector('.scene-holder').clientWidth;
        const h = parent.clientHeight;

        let t = w > h ? h : w;
        //t = t / 2;
        canvas.style.width = `${t}px`;
        canvas.style.height = `${t}px`;
        if (window.devicePixelRatio > 1) {
            t *= 2; // Reina display
        }
        canvas.height = t;
        canvas.width = t;
    },

    render: params => {
        const elem = document.createElement('div');
        elem.innerHTML = template(params);
        return elem;
    },

    getScene: template => {
        return template.querySelector('.scene');
    },

    getMetaBlock: template => {
        return template.querySelector('.game-meta');
    }
};
