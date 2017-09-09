"use strict";
exports.__esModule = true;
var $ = require("jquery");
var utility = require("./utility");
function containerTableFixedHeader(customOptions) {
    var defaultOptions = {
        headerRows: 1,
        fixedClass: 'container-table-fixed-header',
        fixedTop: 0,
        scrollContainer: ''
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
            var $scrollContainer_1 = $table.closest(options.scrollContainer).eq(0);
            if (!$scrollContainer_1.length) {
                return;
            }
            if ($scrollContainer_1.css('position') === '' || $scrollContainer_1.css('position') === 'static') {
                $scrollContainer_1.css('position', 'relative');
            }
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
                var headersTop = $table[0].offsetTop;
                if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()) <= headersTop + $table.outerHeight())) {
                    var clipRight = void 0;
                    var tableVisibleWidth = $scrollContainer_1[0].clientWidth - $table[0].offsetLeft + $scrollContainer_1.scrollLeft();
                    if (tableVisibleWidth < $table.outerWidth()) {
                        clipRight = tableVisibleWidth + 'px';
                    }
                    else {
                        clipRight = 'auto';
                    }
                    var clipLeft = void 0;
                    var tableInvisibleLeft = $scrollContainer_1.scrollLeft() - $table[0].offsetLeft;
                    if (tableInvisibleLeft > 0) {
                        clipLeft = tableInvisibleLeft + 'px';
                    }
                    else {
                        clipLeft = 'auto';
                    }
                    $tableCloned.css({
                        'top': $scrollContainer_1.offset().top - $win.scrollTop() + fixedTop + 'px',
                        'left': $table.offset().left - $win.scrollLeft() + 'px',
                        'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
                        'visibility': 'visible'
                    });
                }
                else {
                    $tableCloned.css('visibility', 'hidden');
                }
                $table.data('positioning', false);
            };
            $scrollContainer_1.scroll(scrollHandler);
            $win.scroll(scrollHandler);
            $win.resize(scrollHandler);
            scrollHandler();
        }
    });
    return this;
}
exports.containerTableFixedHeader = containerTableFixedHeader;
exports["default"] = containerTableFixedHeader;
