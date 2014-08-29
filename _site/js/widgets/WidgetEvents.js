var WidgetEvents = WidgetEvents || {};

// run
(function (exports, $) {
    'use strict';

    exports.elementQuery = new window.ElementQuery('.WidgetEvents', [
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

}(WidgetEvents, jQuery));