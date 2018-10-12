import $ from 'jquery';
import defaultOptions from '../default/regular-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import getFixedTop from '../utility/get-fixed-top';
import findHeader from '../utility/find-header';
import cloneTableHeadersOnly from '../utility/clone-table-headers-only';
import syncWidth from '../utility/sync-width';
import defaultClonedStyle from '../default/cloned-style';
function regularTableFixedHeader(customOptions) {
    const options = $.extend({}, defaultOptions, this.data(), customOptions);
    normalizeOptions(options);
    const { fixedTop: fixedTopOption, fixedClass: fixedClassOption } = options;
    const $win = $(window);
    getUnprocessedTables(this, fixedClassOption).each(function (index, element) {
        const $table = $(element);
        const $headerRows = findHeader($table, options.headerRows);
        if (!$headerRows.length) {
            return;
        }
        const $headerRowGroups = $headerRows.parent();
        let $tableCloned = $table.data('cloned');
        if ($tableCloned) {
            const $tableClonedNew = cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.empty().append($tableClonedNew.children());
            syncWidth($tableCloned.children(), $headerRowGroups);
        }
        else {
            const $scrollContainer = $win;
            $tableCloned = cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.addClass(options.fixedClass);
            $tableCloned.css(defaultClonedStyle);
            $table.data('cloned', $tableCloned);
            $table.after($tableCloned);
            $table.data('positioning', false);
            const scrollHandler = function () {
                if (!$table.is(':visible') || $table.data('positioning')) {
                    return;
                }
                $table.data('positioning', true);
                syncWidth($tableCloned.children(), $headerRowGroups);
                const fixedTop = getFixedTop(fixedTopOption);
                const scrollTop = $scrollContainer.scrollTop();
                const visibleTop = scrollTop + fixedTop;
                const headersTop = $table.offset().top;
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
export default regularTableFixedHeader;
