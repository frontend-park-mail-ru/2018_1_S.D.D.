import EventBus from '../EventBus.js';

let GameEventBus;
if(!GameEventBus) {
    GameEventBus = new EventBus();
}

export default GameEventBus;