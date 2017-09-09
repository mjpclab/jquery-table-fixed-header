"use strict";
exports.__esModule = true;
var $ = require("jquery");
var utility = require("./utility");
function regularTableFixedHeader(customOptions) {
    var defaultOptions = {
        headerRows: 1,
        fixedClass: 'table-fixed-header',
        fixedTop: 0
    };
    var options = $.extend({}, defaultOptions, customOptions);
    if (typeof (options.fixedTop) !== 'function') {
        options.fixedTop = parseInt(options.fixedTop);
    }
    var $win = $(window);
    var getFixedTop = function () {
        return typeof (options.fixedTop) === 'function' ? options.fixedTop() : options.fixedTop;
    };
    this.filter('table:not(.' + options.fixedClass + ')').each(function (index, element) {
        var $table = $(element);
        var $headerRows = utility.findHeader($table, options.headerRows);
        if (!$headerRows.length) {
            return;
        }
        var $headerRowGroups = $headerRows.parent();
        var $tableCloned = $table.data('cloned');
        if ($tableCloned) {
            var $tableClonedNew = utility.cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.empty().append($tableClonedNew.children());
            utility.syncWidth($tableCloned.children(), $headerRowGroups);
        }
        else {
            var $scrollContainer_1 = $win;
            $tableCloned = utility.cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.addClass(options.fixedClass);
            $tableCloned.css(utility.defaultClonedStyle);
            $table.data('cloned', $tableCloned);
            $table.after($tableCloned);
            $table.data('positioning', false);
            var scrollHandler = function () {
                if (!$table.is(':visible') || $table.data('positioning')) {
                    return;
                }
                $table.data('positioning', true);
                utility.syncWidth($tableCloned.children(), $headerRowGroups);
                var fixedTop = getFixedTop();
                var scrollTop = $scrollContainer_1.scrollTop();
                var visibleTop = scrollTop + fixedTop;
                var headersTop = $table.offset().top;
                if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()) <= headersTop + $table.outerHeight())) {
                    $tableCloned.css({
                        'top': fixedTop + 'px',
                        'left': $table.offset().left - $win.scrollLeft() + 'px',
                        'visibility': 'visible'
                    });
                }
                else {
                    $tableCloned.css('visibility', 'hidden');
                }
                $table.data('positioning', false);
            };
            $win.scroll(scrollHandler);
            $win.resize(scrollHandler);
            scrollHandler();
        }
    });
    return this;
}
exports.regularTableFixedHeader = regularTableFixedHeader;
exports["default"] = regularTableFixedHeader;
