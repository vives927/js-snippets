var WidgetTabs = WidgetTabs || {};

(function (exports, $) {
    'use strict';
    var selectItem = function (e) {
            var item = e.currentTarget,
                index = this.$selectorItems.index(item);
            if (index === this.active) return;
            e.preventDefault();
            e.stopPropagation();
            $(item).addClass('active');
            this.$selectorItems.eq(this.active).removeClass('active');
            this.$contentItems.eq(index).addClass('active');
            this.$contentItems.eq(this.active).removeClass('active');
            this.active = index;
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
        this.$selectorItems = this.$selectorUL.find('li');
        this.$contentItems = this.$el.find('.tabContent li');
        this.active = this.$selectorItems.index(this.$selectorItems.filter('.active'));
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