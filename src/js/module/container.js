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
    var findHeader = function ($table) {
        return $table.find('tr:lt(' + options.headerRows + ')');
    };
    this.filter('table').each(function (index, element) {
        var $table = $(element);
        var $scrollContainer = $table.closest(options.scrollContainer).eq(0);
        if (!$scrollContainer.length) {
            return;
        }
        if ($scrollContainer.css('position') === '' || $scrollContainer.css('position') === 'static') {
            $scrollContainer.css('position', 'relative');
        }
        var $headerRows = findHeader($table);
        if (!$headerRows.length) {
            return;
        }
        var $headerRowGroups = $headerRows.parent();
        var $tableCloned = $table.clone();
        var $headerRowsCloned = findHeader($tableCloned);
        var $headerRowGroupsCloned = $headerRowsCloned.parent();
        $tableCloned.find('tr').not($headerRowsCloned).remove();
        $tableCloned.children().not($headerRowGroupsCloned).remove();
        $tableCloned.addClass(options.fixedClass).removeAttr('id').find('[id]').removeAttr('id');
        $tableCloned.css(utility.defaultClonedStyle);
        $table.after($tableCloned);
        $table.data('positioning', false);
        var scrollHandler = function () {
            if (!$table.data('positioning')) {
                $table.data('positioning', true);
                utility.syncWidth($headerRowGroupsCloned, $headerRowGroups);
                var fixedTop = getFixedTop();
                var scrollTop = $scrollContainer.scrollTop();
                var visibleTop = scrollTop + fixedTop;
                var headersTop = $table[0].offsetTop;
                if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()) <= headersTop + $table.outerHeight())) {
                    var clipRight = void 0;
                    var tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft();
                    if (tableVisibleWidth < $table.outerWidth()) {
                        clipRight = tableVisibleWidth + 'px';
                    }
                    else {
                        clipRight = 'auto';
                    }
                    var clipLeft = void 0;
                    var tableInvisibleLeft = $scrollContainer.scrollLeft() - $table[0].offsetLeft;
                    if (tableInvisibleLeft > 0) {
                        clipLeft = tableInvisibleLeft + 'px';
                    }
                    else {
                        clipLeft = 'auto';
                    }
                    $tableCloned.css({
                        'top': $scrollContainer.offset().top - $win.scrollTop() + fixedTop + 'px',
                        'left': $table.offset().left - $win.scrollLeft() + 'px',
                        'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
                        'visibility': 'visible'
                    });
                }
                else {
                    $tableCloned.css('visibility', 'hidden');
                }
                $table.data('positioning', false);
            }
        };
        $scrollContainer.scroll(scrollHandler);
        $win.scroll(scrollHandler);
        $win.resize(scrollHandler);
        scrollHandler();
    });
    return this;
}
exports.containerTableFixedHeader = containerTableFixedHeader;
;
exports["default"] = containerTableFixedHeader;
