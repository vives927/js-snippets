// Event Handler
// https://gist.github.com/cuth/5731924
(function (exports) {
    'use strict';
    exports.EventHandler = function () {
        this.collection = {};
    };
    exports.EventHandler.prototype.bind = function (events, callback) {
        var names = events.split(' '),
            x, xlen = names.length;
        for (x = 0; x < xlen; x += 1) {
            if (typeof this.collection[names[x]] !== 'object') {
                this.collection[names[x]] = [];
            }
            this.collection[names[x]].push(callback);
        }
    };
    exports.EventHandler.prototype.trigger = function (name) {
        var names = name.split(':'),
            args = Array.prototype.slice.call(arguments, 1),
            i, ilen = names.length,
            pieceName = '',
            events, x, xlen;
        for (i = 0; i < ilen; i += 1) {
            pieceName += names[i];
            events = this.collection[pieceName];
            if (typeof events === 'object') {
                xlen = events.length;
                for (x = 0; x < xlen; x += 1) {
                    if (typeof events[x] === 'function') {
                        events[x].apply(this, args);
                    }
                }
            }
            pieceName += ':';
        }
    };
}(this));