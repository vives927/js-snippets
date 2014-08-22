var WidgetRotatingBanner = WidgetRotatingBanner || {};


// Debounce
// https://gist.github.com/cuth/6a23f6464ed58ec98bf5
(function (exports) {
    'use strict';
    exports.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function() {
                var last = (new Date()) - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };
}(this));


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

// Timer used for hero slider
// https://gist.github.com/cuth/5732072
(function (exports, $) {
    'use strict';
    exports.HeroTimer = function (opts) {
        var defaults = {
            delay: 5000,
            start: null
        };
        this.opts = $.extend(defaults, opts);
        this.timeout = null;
        this.onHold = false;
        return this;
    };
    exports.HeroTimer.prototype = {
        start: function (unhold) {
            var self = this;
            if (unhold) this.onHold = false;
            if (this.onHold) return;
            this.timeout = setTimeout(function () {
                if (typeof self.opts.start === 'function') {
                    self.opts.start();
                }
            }, this.opts.delay);
        },
        stop: function () {
            clearTimeout(this.timeout);
            this.timeout = null;
        },
        restart: function () {
            this.stop();
            this.start();
        },
        hold: function () {
            this.stop();
            this.onHold = true;
        }
    };
}(WidgetRotatingBanner, jQuery));

// Hero slider used on multiple pages
// uses vendor/fluidSlider.js
(function (exports, $) {
    'use strict';
    var $createBullets = function () {
            var html = '<li class="active"><span></span>',
                $ul;
            for (var x = 1, xlen = this.$slides.length; x < xlen; x += 1) {
                html += '<li><span></span>';
            }
            $ul = $('<ul/>', {
                'class': 'bullets',
                'html': html
            });
            this.$el.prepend($ul);
            return $ul;
        },
        activate = function (index) {
            this.timer.restart();
            this.$bullets.eq(this.current).removeClass('active');
            this.$bullets.eq(index).addClass('active');
            this.current = index;
        },
        goToBullet = function (index) {
            if (this.current === index) return;
            this.fluidSlider.slideTo(index);
        },
        increment = function () {
            var index = this.current + 1;
            if (index >= this.$slides.length) {
                index = 0;
            }
            goToBullet.call(this, index);
        },
        bindEvents = function () {
            var self = this;
            this.$bullets.click(function() {
                goToBullet.call(self, $(this).index());
            });
            this.fluidSlider.events.bind('done', activate.bind(this));
        },
        init = function (el) {
            this.$el = $(el);
            this.fluidSlider = new window.FluidSlider(this.$el);
            if (!this.fluidSlider.result) return false;
            this.$slides = this.$el.find('.slides li');
            if (this.$slides.length < 2) return false;
            this.$bullets = $createBullets.call(this).find('li');
            this.current = 0;
            bindEvents.call(this);
            this.timer = new WidgetRotatingBanner.HeroTimer({
                delay: (parseInt(this.$el.attr('data-delay'), 10) * 1000) || 5000,
                start: increment.bind(this)
            });
            this.timer.start();
            return true;
        };
    exports.HeroSlider = function (el) {
        this.result = init.call(this, el);
    };
}(WidgetRotatingBanner, jQuery));


// calculate hero slider height for mobile view
(function (exports, $) {
    'use strict';
    var setHeight = function() {
            this.$el.find('.slides').removeAttr('style');
            //console.log(this.$el.attr('data-eq-state'));
            if (this.$el.attr('data-eq-state') !== 'large') {
                var $overlay = this.$el.find('.slides .overlay'), 
                    textHeight = 0,
                    imageHeight = this.$el.find('.image').height();
                $overlay.each(function() {
                    if ($(this).height() > textHeight) {
                        textHeight = $(this).outerHeight();
                    }
                });
                var sliderHeight = imageHeight + textHeight;
                this.$el.find('.slides').css({'height': sliderHeight});
            }
        },
        bindEvents = function() {
            var self = this;
            $(window).on('resize', window.debounce(function () {
                setHeight.call(self);
            }, 150));
            $(window).on('load', function() {
                setHeight.call(self);
            });
        },
        init = function (el) {
            this.$el = $(el);
            if (!this.$el.length) return false;
            bindEvents.call(this);
            return true;
        };
    exports.HeroResize = function (el) {
        this.result = init.call(this, el);
    };
}(WidgetRotatingBanner, jQuery));

// Run
(function (exports, $) {
    'use strict';

    exports.sliderImages = new window.MediaQueryImgAttrs('.WidgetRotatingBanner .image', [
        {
            'mediaQuery': '(max-width: 320px)',
            'attrName': 'data-mobile'
        },
        {
            'mediaQuery': '(max-width: 750px)',
            'attrName': 'data-tablet'
        },
        {
            'attrName': 'data-desktop'
        }
    ]);

    exports.sliders = $.map($('.WidgetRotatingBanner'), function (widget) {
        var slider = new WidgetRotatingBanner.HeroSlider(widget);
        var resize = new WidgetRotatingBanner.HeroResize(widget);

        return {
            'slider': slider,
            'resize': resize
        };
    });

}(WidgetRotatingBanner, jQuery));