var WidgetTabs = WidgetTabs || {};

(function (exports, $) {
    'use strict';
    var selectItem = function (e) {
            var item = e.currentTarget,
                id = $(item).attr('aria-controls');
            // Ignore if item is already selected
            if ($(item).is('[aria-selected=true]')) return;
            e.preventDefault();
            e.stopPropagation();
            // Hide unselected items
            this.$selectorItems.attr('aria-selected', false).attr('tabindex', '-1');
            this.$contentItems.attr('aria-hidden', true);
            // Show selected items
            $(item).attr('aria-selected', true).attr('tabindex', '0');
            $('#' + id).attr('aria-hidden', false);
            
            this.$selectorUL.removeClass('open');
        },
        openSelector = function (e) {
            e.preventDefault();
            this.$selectorUL.addClass('open');
        },
        bindEvents = function () {
            this.$selectorItems.on('click', selectItem.bind(this));
            this.$selectorUL.on('click', openSelector.bind(this));
        };
    exports.Tabs = function (el) {
        this.$el = $(el);
        this.$selectorUL = this.$el.find('.tabs');
        this.$selectorItems = this.$selectorUL.find('.tab');
        this.$contentItems = this.$el.find('.tab-content');
        bindEvents.call(this);
    };
}(WidgetTabs, jQuery));

// run
(function (exports, $) {
    'use strict';

    exports.elementQuery = new window.ElementQuery('.WidgetTabs', [
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
    
    exports.tabGroups = $.map($('.WidgetTabs'), function (widget) {
        var tabs = new WidgetTabs.Tabs(widget);

        return {
            'tabs': tabs
        };
    });

}(WidgetTabs, jQuery));