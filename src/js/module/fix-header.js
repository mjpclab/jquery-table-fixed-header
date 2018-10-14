import $ from 'jquery';
import getFixedTop from '../utility/get-fixed-top';
import findHeader from '../utility/find-header';
import cloneTableHeadersOnly from '../utility/clone-table-headers-only';
import syncWidth from '../utility/sync-width';
const $empty = $([]);
function FixHeader(table, options, getScrollContainer, getUpdatedStyles, bindScrollEventHandler) {
    const $table = $(table);
    const context = {
        $table,
        options,
        $scrollContainer: $empty,
    };
    const { headerRows, fixedTop: fixedTopOption } = options;
    //header rows
    const $headerRows = findHeader($table, headerRows);
    if (!$headerRows.length) {
        return;
    }
    const $headerRowGroups = $headerRows.parent();
    //scroll container
    const $scrollContainer = context.$scrollContainer = getScrollContainer(context);
    if (!$scrollContainer.length) {
        return;
    }
    //cloned
    const $tableCloned = cloneTableHeadersOnly($table, options);
    $table.after($tableCloned);
    //scroll handler
    let positioning = false;
    const scrollHandler = () => {
        if (positioning || $table.is(':hidden')) {
            return;
        }
        positioning = true;
        syncWidth($tableCloned.children(), $headerRowGroups);
        const fixedTop = getFixedTop(fixedTopOption);
        const scrollTop = $scrollContainer.scrollTop();
        const visibleTop = scrollTop + fixedTop;
        const headersTop = $table[0].offsetTop;
        if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()) <= headersTop + $table.outerHeight())) {
            const styles = getUpdatedStyles(fixedTop, context);
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
