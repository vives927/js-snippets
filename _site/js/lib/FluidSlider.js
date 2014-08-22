/* Fluid Slider
 * version 2.1
 * https://github.com/cuth/fluid-slider
 */
(function (exports, $) {
    var defaults = {
            mode: 'position', // modes: 'transform', 'position',
            enabledClass: 'enabled',
            activeClass: 'active',
            motionSpeed: 400
        },
        plus1 = function (num) {
            return (num + 1 >= this.lng) ? 0 : num + 1;
        },
        minus1 = function (num) {
            return (num - 1 < 0) ? this.lng - 1 : num - 1;
        },
        setCurrent = function (num) {
            // use this to trigger an event
            this.current = num;
        },
        motionComplete = function (el, location) {
            var $el = $(el).removeAttr('style');
            if (location === 0) {
                $el.addClass(this.opts.activeClass);
            }
            this.inMotion = false;
            resetDrag.call(this);
        },
        slideTo = function (num, location) {
            var self = this,
                $item = this.$items.eq(num).stop(true);
            this.inMotion = true;
            if (location !== 0) {
                $item.removeClass(this.opts.activeClass);
                this.events.trigger('done', this.current);
            }
            if (this.opts.mode === 'transform') {
                $item.transition({ 'translate': [(this.width * location),0] }, this.opts.motionSpeed, 'in-out', function () {
                    motionComplete.call(self, this, location);
                });
                return;
            }
            if (this.opts.mode === 'position') {
                $item.animate({ 'left': this.width * location }, this.opts.motionSpeed, 'swing', function () {
                    motionComplete.call(self, this, location);
                });
            }
        },
        setTo = function (num, x) {
            var $item = this.$items.eq(num).stop(true);
            if (this.opts.mode === 'transform') {
                $item.css('transform', 'translate(' + x + 'px,0)');
                return;
            }
            if (this.opts.mode === 'position') {
                $item.css('left', x + 'px');
                return;
            }
        },
        clear = function (num) {
            this.$items.eq(num).removeAttr('style');
        },
        resetDrag = function () {
            this.dragger.setPosition({ x: 0, y: 0 });
        },
        onDrag = function (x) {
            var i = this.current;
            if (this.inMotion) return;
            setTo.call(this, i, x);
            if (x < 0) {
                clear.call(this, minus1.call(this, i));
                setTo.call(this, plus1.call(this, i), x + this.width);
                return;
            }
            if (x > 0) {
                clear.call(this, plus1.call(this, i));
                setTo.call(this, minus1.call(this, i), x - this.width);
                return;
            }
            clear.call(this, minus1.call(this, i));
            clear.call(this, plus1.call(this, i));
        },
        onStop = function (x) {
            var i = this.current;
            if (x < -this.width / 3) {
                setCurrent.call(this, plus1.call(this, i));
                slideTo.call(this, i, -1);
                slideTo.call(this, this.current, 0);
                return;
            }
            if (x > this.width / 3) {
                setCurrent.call(this, minus1.call(this, i));
                slideTo.call(this, i, 1);
                slideTo.call(this, this.current, 0);
                return;
            }
            if (x < 0) {
                slideTo.call(this, i, 0);
                slideTo.call(this, plus1.call(this, i), 1);
                return;
            }
            if (x > 0) {
                slideTo.call(this, i, 0);
                slideTo.call(this, minus1.call(this, i), -1);
            }
        },
        getDraggerOptions = function () {
            var self = this;
            return {
                'drag': function (pos) {
                    onDrag.call(self, pos.x);
                },
                'stop': function (pos) {
                    if (pos) {
                        onStop.call(self, pos.x);
                    }
                },
                'allowVerticalScrolling': true,
                'bounds': {
                    minX: -this.width,
                    maxX: this.width,
                    minY: 0,
                    maxY: 0
                }
            };
        },
        getWidth = function () {
            return this.$el.width();
        },
        bindEvents = function () {
            var self = this;
            $(window).on('resize', window.debounce(function () {
                self.width = getWidth.call(self);
                self.dragger.opts.bounds = {
                    minX: -self.width,
                    maxX: self.width,
                    minY: 0,
                    maxY: 0
                };
            }, 150));
        },
        init = function (el, options) {
            this.$el = $(el);
            if (!this.$el.length) return false;
            this.$items = this.$el.find('.slides li');
            setCurrent.call(this, 0);
            this.lng = this.$items.length;
            if (this.lng < 2) return false;
            this.opts = $.extend({}, defaults, options);
            this.events = new window.EventHandler();
            this.inMotion = false;
            this.width = getWidth.call(this);
            this.dragger = new window.Dragger(this.$el, getDraggerOptions.call(this));
            this.$el.addClass(this.opts.enabledClass);
            bindEvents.call(this);
            return true;
        };
    exports.FluidSlider = function (el, options) {
        this.result = init.call(this, el, options);
    };
    exports.FluidSlider.prototype.slideMinus1 = function () {
        var i = this.current;
        setCurrent.call(this, minus1.call(this, i));
        setTo.call(this, i, 0);
        setTo.call(this, this.current, -this.width);
        slideTo.call(this, i, 1);
        slideTo.call(this, this.current, 0);
    };
    exports.FluidSlider.prototype.slidePlus1 = function () {
        var i = this.current;
        setCurrent.call(this, plus1.call(this, i));
        setTo.call(this, i, 0);
        setTo.call(this, this.current, this.width);
        slideTo.call(this, i, -1);
        slideTo.call(this, this.current, 0);
    };
    exports.FluidSlider.prototype.slideTo = function (num) {
        var i = this.current;
        setCurrent.call(this, num);
        setTo.call(this, i, 0);
        if (num > i) {
            setTo.call(this, num, this.width);
            slideTo.call(this, i, -1);
        } else {
            setTo.call(this, num, -this.width);
            slideTo.call(this, i, 1);
        }
        slideTo.call(this, num, 0);
    };
}(this, jQuery));