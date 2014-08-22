// TrackSlide
(function (exports, $) {
    'use strict';
    var moveTo = function (index) {
            index = Math.max(0, index);
            index = Math.min(index, this.lng - this.m.fit);
            var left = -index * this.m.fullItem;
            if (left < this.m.bounds - this.m.track + this.m.gap) {
                left = this.m.bounds - this.m.track + this.m.gap;
            }
            this.$track.stop(true).animate({'left': left}, 400, 'swing');
            this.dragger.setPosition({
                x: left,
                y: 0
            });
            this.current = index;
            this.events.trigger('done', index, this.lng - this.m.fit);
        },
        reset = function() {
            this.$track.stop(true).animate({'left': 0}, 400, 'swing');
            this.dragger.setPosition({
                x: 0,
                y: 0
            });
            this.events.trigger('done', 0, this.lng - this.m.fit);
        },
        onStart = function () {
            this.preventClick = false;
        },
        onDrag = function (handle) {
            this.preventClick = true;
            this.$track.css('left', handle.x);
        },
        onStop = function (handle) {
            if (!handle) return;
            var closest = Math.round(handle.x / this.m.fullItem);
            closest = Math.min(0, closest);
            closest = Math.max(closest, -this.lng + this.m.fit);
            moveTo.call(this, -closest);
        },
        getMeasurement = function () {
            var bounds = this.$el.width(),
                track = this.$track.outerWidth(),
                item = this.$items.eq(0).width(),
                gap = this.$items.eq(1).position().left - this.$items.eq(0).position().left - item,
                fullItem = item + gap,
                fit = Math.floor((bounds + gap + 1) / fullItem);
            return {
                'bounds': bounds,
                'track': track,
                'item': item,
                'gap': gap,
                'fullItem': fullItem,
                'fit': fit
            };
        },
        anchorClick = function (e) {
            if (this.preventClick) {
                e.preventDefault();
            }
        },
        resize = function () {
            this.m = getMeasurement.call(this);
            if (this.$items.length <= this.m.fit) {
                reset.call(this);
                this.dragger.disable();
            } else {
                this.dragger.enable();
                moveTo.call(this, this.current);
            }
        },
        bindEvents = function () {
            $(window).on('resize', window.debounce(resize.bind(this), 150));
            this.$el.on('click', 'a', anchorClick.bind(this));
        },
        getDraggerOptions = function () {
            return {
                'start': onStart.bind(this),
                'drag': onDrag.bind(this),
                'stop': onStop.bind(this),
                'allowVerticalScrolling': true
            };
        },
        init = function (el) {
            this.$el = $(el);
            this.$track = this.$el.find('ul');
            if (!this.$el.length) return false;
            this.$items = this.$track.find('li');
            this.lng = this.$items.length;
            if (this.lng < 2) return false; 
            this.events = new window.EventHandler();
            this.m = getMeasurement.call(this);
            this.current = 0;
            this.dragger = new window.Dragger(el, getDraggerOptions.call(this));
            // if not enough items for sliding
            if (this.$items.length <= this.m.fit) {
                this.dragger.disable();
            }
            bindEvents.call(this);
            return true;
        };
    exports.TrackSlide = function (el) {
        this.result = init.call(this, el);
    };
    exports.TrackSlide.prototype.moveTo = moveTo;
}(this, jQuery));