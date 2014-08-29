var WidgetMediaGallery = WidgetMediaGallery || {};

// testing locally
var Google_API_Key = 'AIzaSyBLk4vEE-v8wZnIP3KlbVHUf-WGs7FJguY';

// Generic Slider
(function (exports, $) {
    'use strict';
    var showArrows = function (index, max) {
            if (index > 0) {
                this.$arrowLeft.addClass('enabled');
            } else {
                this.$arrowLeft.removeClass('enabled');
            }
            if (index < max) {
                this.$arrowRight.addClass('enabled');
            } else {
                this.$arrowRight.removeClass('enabled');
            }
        },
        increment = function () {
            this.track.moveTo(this.track.current + 1);
        },
        decrement = function () {
            this.track.moveTo(this.track.current - 1);
        },
        bindEvents = function () {
            this.$arrowLeft.on('click', decrement.bind(this));
            this.$arrowRight.on('click', increment.bind(this));
            this.track.events.bind('done', showArrows.bind(this));
        },
        buildArrows = function () {
            this.$arrowLeft = $('<div/>', { 'class': 'arrow left' });
            this.$arrowRight = $('<div/>', { 'class': 'arrow right' });
            /*if (this.$el.hasClass('Slider')) {
                this.$el.append(this.$arrowLeft, this.$arrowRight);
                return;
            }*/
            this.$slider.append(this.$arrowLeft, this.$arrowRight);
        },
        init = function (el) {
            this.$el = $(el);
            this.$slider = this.$el.find('.slider');
            this.track = new window.TrackSlide(this.$el.find('.track'));
            if (!this.track.result) return false;
            buildArrows.call(this);
            showArrows.call(this, this.track.current, this.track.lng - this.track.m.fit);
            bindEvents.call(this);
            return true;
        };
    exports.Slider = function (el) {
        this.result = init.call(this, el);
    };
}(WidgetMediaGallery, jQuery));

(function (exports, $) {
    'use strict';
    var getDataFromYoutube = function (id, callback) {
            var data = {
                    'key': Google_API_Key,
                    'part': 'id, snippet, player',
                    'id': id,
                    'maxResults': 1
                };
            $.ajax({
                'url': 'https://www.googleapis.com/youtube/v3/videos?callback=?',
                'data': data,
                'type': 'GET',
                'dataType': 'json',
                'success': callback
            });
        },
        receivedVideos = function (data) {
            var item, $a;
            for (var x = 0, xlen = data.items.length; x < xlen; x += 1) {
                item = data.items[x];
                $a = this.$videos.filter('[href="' + item.id + '"]');
                $a.append('<img src="' + item.snippet.thumbnails.medium.url + '" alt="' + item.snippet.title + '" />');
                $a.attr('title', item.snippet.title);
                $a.data('desc', item.snippet.description);
            }
        },
        loadVideoImages = function () {
            var videos = [];
            this.$videos.each(function (i) {
                videos[i] = $(this).attr('href');
            });
            getDataFromYoutube.call(this, videos.join(','), receivedVideos.bind(this));
        },
        activate = function (link) {
            this.$links.removeClass('active');
            $(link).addClass('active');
            updateCurrent.call(this);
        },
        picSwap = function (href, title, desc) {
            var img = '<img src="' + href + '" alt="" />';
            this.$media.html(img);
            this.$title.html(title);
            this.$desc.html(desc);
            return true;
        },
        videoSwap = function (href, title, desc) {
            var embedCode = '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + href + '?wmode=opaque" frameborder="0" allowfullscreen></iframe>';
            if (!embedCode) return false;
            this.$media.html(embedCode);
            if ($.fn.fitVids) {
                this.$container.fitVids();
            }
            this.$title.html(title);
            this.$desc.html(desc);
            return true;
        },
        updateCurrent = function() {
            this.$current.html(this.current + 1);
        },
        triggerSwap = function ($swapItem) {
            var href = $swapItem.attr('href'),
                title = $swapItem.attr('title'),
                desc = $swapItem.data('desc');
            if (/.jpg|.jpeg|.png|.gif/i.test(href)) {
                return picSwap.call(this, href, title, desc);
            } else {
                return videoSwap.call(this, href, title, desc);
            }
        },
        bindEvents = function () {
            var self = this;
            this.$links.on('click', function (e) {
                e.preventDefault();
                self.current = $(this).parent('li').index();
                if (triggerSwap.call(self, $(this))) {
                    activate.call(self, this);
                }
            });
        },
        init = function (el) {
            this.$el = $(el);
            if (!this.$el.length) return false;
            this.$container = this.$el.find('.viewer');
            this.$links = this.$el.find('.thumb');
            this.$media = this.$el.find('div.media');
            this.$title = this.$el.find('div.title');
            this.$desc = this.$el.find('div.desc');
            this.$videos = this.$links.filter('[data-type="video"]');
            this.$total = this.$el.find('.total').html(this.$links.length);
            this.$current = this.$el.find('.current');
            this.current = 0;
            if (this.$videos.length > 0) {
                loadVideoImages.call(this);
            }
            this.$links.first().addClass('active');
            triggerSwap.call(this, this.$links.first());
            updateCurrent.call(this);
            bindEvents.call(this);
            return true;
        };
    exports.Swapper = function (el) {
        this.result = init.call(this, el);
    };
}(WidgetMediaGallery, jQuery));

// run
(function (exports, $) {
    'use strict';

    exports.elementQuery = new window.ElementQuery('.WidgetMediaGallery', [
        {
            'name': 'small',
            'maxWidth': 767
        },
        {
            'name': 'medium',
            'minWidth': 768,
            'maxWidth': 1023
        },
        {
            'name': 'large',
            'minWidth': 1024
        }
    ], {
        'callback': function ($el, size) {
            
        }
    });

    exports.galleries = $.map($('.WidgetMediaGallery'), function (widget) {
        var slider = new WidgetMediaGallery.Slider(widget);
        var swapper = new WidgetMediaGallery.Swapper(widget);

        return {
            'slider': slider,
            'swapper': swapper
        };
    });

}(WidgetMediaGallery, jQuery));