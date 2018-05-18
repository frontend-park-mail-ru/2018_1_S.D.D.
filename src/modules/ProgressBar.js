'use strict'

/**
 * 
 * @class
 * @classdesc Shows page loading progress.
 */
export default class ProgressBar {
    /**
     * Display progress bar with 10% ready.
     */
    static start() {
        this.parent = document.querySelector('.progress');
        this.parent.innerHTML = '';
        this.bar = document.createElement('div');
        this.bar.classList.add('progress__bar');
        this.parent.appendChild(this.bar);
        this.parent.style.height = '5px';
        this.progress = 10;
        this.bar.style.width = `${this.progress}%`;
        console.log(this.bar.style.width);
    }

    /**
     * Set progress +15%.
     */
    static step() {
        this.progress += 15;
        this.bar.style.width = `${this.progress}%`;
    }

    /**
     * Set progress 100% and hide bar.
     */
    static finish() {
        this.progress = 100;
        window.setTimeout(() => {
            this.bar.style.width = `${this.progress}%`;
        }, 100);
        window.setTimeout(() => {
            this.parent.style.height = '0px';
        }, 1000);
    }
}