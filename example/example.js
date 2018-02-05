import Keyframes from '@keyframes/core';
import Proximity from '../src/keyframes.proximity';

Keyframes.plugin(Proximity);

const $ = selector => document.querySelectorAll(selector)[0];

const blockElem = $('.block');
const bc2 = $('.block-container.bc2').getBoundingClientRect();
const block = new Keyframes(blockElem);

const topPosition = {
    top: '20px',
};

Keyframes.define([{
    name: 'initiate',
    '0%': {
        top: '-100px',
    },
    '100%': topPosition,
}, {
    name: 'makeTheMove',
    '0%': topPosition,
    '100%': {
        top: `${bc2.top - 20}px`,
    },
}]);

window.onload = function () {
    let readyToProximity = false;
    let isMoving = false;
    let directionSwitch = true;

    block.play('initiate 1s ease 0s 1 normal forwards', () => {
        readyToProximity = true;
    });

    block.proximity((obj) => {
        if (readyToProximity) {
            blockElem.style.boxShadow = `red 0 0 ${0.5 * obj.distancePercentage}px`;
        }
    });

    blockElem.addEventListener('mouseover', (e) => {
        if (!isMoving) {
            isMoving = true;
            const direction = directionSwitch ? 'normal' : 'reverse';
            directionSwitch = !directionSwitch;
            block.reset(() => block.play(`makeTheMove 2s ease 0s 1 ${direction} forwards`, () => {
                isMoving = false;
            }));
        }
    });
};
