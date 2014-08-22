var jsSnippets = jsSnippets || {};

/* Back to top button */
(function ($) {
    'use strict';
    $(window).scroll(function() {
        if($(window).scrollTop() > 100) {
            $('a.backToTop').show();
        } else {
            $('a.backToTop').hide();
        }
    });
    $('a.backToTop').click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: 0
        }, 600);
        return false;
    });
}(jQuery));


/* Search bar */
(function ($) {
    'use strict';
    $('#btnHeaderSearch').on('click', function (e) {
        var searchText = $('#txtHeaderSearch').val(),
            searchUrl = window.location.protocol + '//' + window.location.host + '/search/' + '?q=' + searchText;
        e.preventDefault();
        window.location = searchUrl;
    });
    $("#txtHeaderSearch").keyup(function (e) {
        if (e.keyCode == 13) {
            $("#btnHeaderSearch").click();
        }
    });
}(jQuery));



/* Split list into two even columns */
(function(exports, $) {
    'use strict';
    var init = function(el) {
        var $list = $(el),
            $listItems = $list.children('li'),
            splitAt = Math.round($listItems.length / 2),
            $cloneList = $list.clone().insertAfter($list),
            $cloneListItems = $cloneList.children('li');
        for (var i = 0; i < $cloneListItems.length; i++) {
            if (i < splitAt) {
                $cloneListItems[i].remove();
            }
        }
        for (i = 0; i < $listItems.length; i++) {
            if (i >= splitAt) {
                $listItems[i].remove();
            }
        }
    };
    exports.SplitList = function(el) {
        this.result = init.call(this, el);
    };
}(jsSnippets, jQuery));

/* Make 2 cols the same height */
(function(exports, $) {
    'use strict';
    var init = function(el) {
        var $col1 = $(el).children('div:first-child'), 
            col1Height = $col1.outerHeight(),
            $col2 = $col1.next('div'), 
            col2Height = $col2.outerHeight();

        if (col1Height > col2Height) {
            $col2.css({ height: col1Height });
        }
        else if (col1Height < col2Height) {
            $col1.css({ height: col2Height });
        }
        else {
            return false;
        }
    };
    exports.MatchColHeight = function(el) {
        this.result = init.call(this, el);
    };
}(jsSnippets, jQuery));

/* Change font size */
(function(exports, $) {
    'use strict';
    var bindEvents = function() {
        var self = this;
        $('a.largerFont').click(function (e) {
            e.preventDefault();
            var size = self.$frame.css('fontSize').replace('px', '');
            var upSize = (parseInt(size) + 1) + 'px';
            self.$frame.css({ fontSize: upSize });
        });
        $('a.smallerFont').click(function (e) {
            e.preventDefault();
            var size = self.$frame.css('fontSize').replace('px', '');
            var downSize = (parseInt(size) - 1) + 'px';
            self.$frame.css({ fontSize: downSize });
        });
    },
    init = function(el) {
        this.$frame = $(el);
        bindEvents.call(this);
    };
    exports.ChangeFontSize = function(el) {
        this.result = init.call(this, el);
    };
}(jsSnippets, jQuery));

/* RUN!! */
(function(exports, $) {
    'use strict';

    new jsSnippets.SplitList('ul.longList');
    new jsSnippets.MatchColHeight('div.twoCol');
    new jsSnippets.ChangeFontSize('body');

}(jsSnippets, jQuery));