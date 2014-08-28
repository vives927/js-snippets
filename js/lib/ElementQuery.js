/*!
 * ElementQuery
 * https://bitbucket.org/c2group/element-query
 * version: 1.0.0
 */
/*exported ElementQuery */

var ElementQuery = (function ($) {
    'use strict';

    // App

    var collection = [];

    var adjustCollections = function () {
        collection.forEach(function (eq) {
            measure.call(eq);
        });
    };

    var bindWindow = function () {
        $(window).on('resize', debounce(adjustCollections));
    };


    // Instance

    var defaults = {
        'attribute': 'data-size',
        'callback': null
    };

    /**
     * Get element size
     * @param {HTMLElement} el
     * @return {Array} size
     */
    var getElementSize = function ($el) {

        // get the width of the parent to prevent infinite loops
        var width = Math.round($el.parent().width());

        return this.queries.filter(function (query) {
            return (width >= query.minWidth || !query.minWidth) && (width <= query.maxWidth || !query.maxWidth);
        }).map(function (query) {
            return query.name;
        });
    };

    /**
     * Change item size
     * @param {Object} item
     * @param {Array} size
     */
    var changeSize = function (item, size) {
        item.$el.attr(this.options.attribute, size.join(' '));
        item.size = size;
        if (typeof this.options.callback === 'function') {
            this.options.callback(item.$el, size);
        }
    };

    /**
     * Measure the elements of an instance for differences
     */
    var measure = function () {
        var self = this;
        this.items.forEach(function (item) {
            var size = getElementSize.call(self, item.$el).sort();
            if (item.size.join(' ') !== size.join(' ')) {
                changeSize.call(self, item, size);
            }
        });
    };

    /**
    * EQ
    * @param {jQuery} collection of elements
    * @param {Array} array of objects specifying queries
    *   {
    *       'name': {String},
    *       'minWidth': {Number},
    *       'maxWidth': {Number}
    *   }
    * @param {Object} options
    *   {
    *       'attribute': {String},
    *       'callback': {Function}
    *   }
    * @constructor
    */
    var EQ = function (elements, queries, options) {
        var $elements = $(elements);

        if (!$elements.length || typeof queries !== 'object') return;

        this.items = $.map($elements, function (element) {
            return {
                '$el': $(element),
                'size': []
            };
        });

        this.queries = queries;

        this.options = $.extend({}, defaults, options);

        if (collection.length === 0) {
            bindWindow();
        }
        collection.push(this);

        measure.call(this);
    };


    // Public

    /**
     * Re-measure the elements
     */
    EQ.prototype.measure = measure;

    /**
     * Get items
     * @return {Array}
     */
    EQ.prototype.getItems = function () {
        return this.items;
    };

    /**
     * Get size by element
     * @param {jQuery|HTMLElement|selector}
     * @return {Array} size
     */
    EQ.prototype.getSizeByElement = function (el) {
        return $.grep(this.items, function (item) {
            return item.$el.is(el);
        })[0].size;
    };

    /**
     * Get elements by size
     * @param {String} size name
     * @return {jQuery}
     */
    EQ.prototype.getElementsBySize = function (size) {
        var elements = $.grep(this.items, function (item) {
            return item.size.indexOf(size) > -1;
        }).map(function (item) {
            return item.$el[0];
        });
        return $(elements);
    };

    /**
     * Set callback
     * @param {Function}
     */
    EQ.prototype.setCallback = function (fn) {
        this.options.callback = fn;
    };


    // Helper

    /**
     * requestAnimationFrame debounce
     * @param {function} callback
     */
    function debounce(fn) {
        var id;
        return function () {
            var args = arguments;
            if (id !== null) {
                cancelAnimationFrame(id);
            }
            id = requestAnimationFrame(function () {
                fn.apply(null, args);
                id = null;
            });
        };
    }

    return EQ;

}(jQuery));
