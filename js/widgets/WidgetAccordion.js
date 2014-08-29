var WidgetAccordion = WidgetAccordion || {};

(function (exports, $) {
    'use strict';
    var bindEvents = function() {
            var self = this;
            this.$title.click(function (e) {
                e.preventDefault();
                var $parent = $(this).parents('.group');
                if ($parent.hasClass('active')) {
                    self.$acc.removeClass('active').find('.desc').slideUp();
                    return false;
                } else {
                    self.$acc.removeClass('active').find('.desc').slideUp();
                    $(this).siblings('.desc').slideDown(function() {
                        $parent.addClass('active');
                    });
                }
            });
        };
    exports.Accordion = function (el) {
        this.$el = $(el);
        this.$acc = this.$el.find('.group');
        this.$title = this.$el.find('.title');
        bindEvents.call(this);
    };
}(WidgetAccordion, jQuery));

// run
(function (exports, $) {
    'use strict';

    exports.elementQuery = new window.ElementQuery('.WidgetAccordion', [
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

    exports.accordions = $.map($('.WidgetAccordion'), function (widget) {
        var accordion = new WidgetAccordion.Accordion(widget);

        return {
            'accordion': accordion
        };
    });

}(WidgetAccordion, jQuery));