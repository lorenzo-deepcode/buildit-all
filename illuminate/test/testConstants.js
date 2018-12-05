'use strict'

exportConstant('UNITTESTPROJECT', 'COLLECTION-FOR-UNITESTING');

function exportConstant (name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
