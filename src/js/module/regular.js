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
    var findHeader = function ($table) {
        return $table.find('tr:lt(' + options.headerRows + ')');
    };
    this.filter('table').each(function (index, element) {
        var $table = $(element);
        var $scrollContainer = $win;
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
            }
        };
        $win.scroll(scrollHandler);
        $win.resize(scrollHandler);
        scrollHandler();
    });
    return this;
}
exports.regularTableFixedHeader = regularTableFixedHeader;
;
exports["default"] = regularTableFixedHeader;
