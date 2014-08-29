var WidgetNews = WidgetNews || {};

// run
(function (exports, $) {
    'use strict';

    exports.elementQuery = new window.ElementQuery('.WidgetNews', [
        {
            'name': 'small',
            'maxWidth': 767
        },
        {
            'name': 'large',
            'minWidth': 768
        }
    ], {
        'callback': function ($el, size) {
            
        }
    });

}(WidgetNews, jQuery));