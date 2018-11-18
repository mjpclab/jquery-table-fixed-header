import $ from 'jquery';
import getFixedTop from '../utility/get-fixed-top';
import findHeader from '../utility/find-header';
import cloneTableHeadersOnly from '../utility/clone-table-headers-only';
import syncWidth from '../utility/sync-width';
var $empty = $([]);
function FixHeader(table, options, getScrollContainer, getUpdatedStyles, bindScrollEventHandler) {
    var $table = $(table);
    var context = {
        $table: $table,
        options: options,
        $scrollContainer: $empty
    };
    var headerRows = options.headerRows, fixedTopOption = options.fixedTop;
    //header rows
    var $headerRows = findHeader($table, headerRows);
    if (!$headerRows.length) {
        return;
    }
    var $headerRowGroups = $headerRows.parent();
    //scroll container
    var $scrollContainer = context.$scrollContainer = getScrollContainer(context);
    if (!$scrollContainer.length) {
        return;
    }
    //cloned
    var $tableCloned = cloneTableHeadersOnly($table, options);
    $table.after($tableCloned);
    //scroll handler
    var positioning = false;
    var scrollHandler = function () {
        if (positioning || $table.is(':hidden')) {
            return;
        }
        positioning = true;
        syncWidth($tableCloned.children(), $headerRowGroups);
        var fixedTop = getFixedTop(fixedTopOption);
        var scrollTop = $scrollContainer.scrollTop();
        var visibleTop = scrollTop + fixedTop;
        var headersTop = $table[0].offsetTop;
        if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()) <= headersTop + $table.outerHeight())) {
            var styles = getUpdatedStyles(fixedTop, context);
            styles.visibility = 'visible';
            $tableCloned.css(styles);
        }
        else {
            $tableCloned.css('visibility', 'hidden');
        }
        positioning = false;
    };
    //bind events
    bindScrollEventHandler(scrollHandler, context);
    scrollHandler();
}
export default FixHeader;
