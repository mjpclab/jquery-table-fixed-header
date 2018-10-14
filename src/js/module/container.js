import $ from 'jquery';
import defaultOptions from '../default/container-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import FixHeader from './fix-header';
const $win = $(window);
function tableFixedHeader(customOptions) {
    const options = $.extend({}, defaultOptions, this.data(), customOptions);
    normalizeOptions(options);
    getUnprocessedTables(this, options.fixedClass).each(function (index, table) {
        FixHeader(table, options, function getScrollContainer(context) {
            const { $table, options } = context;
            const $scrollContainer = $table.closest(options.scrollContainer).eq(0);
            if ($scrollContainer.length) {
                const scrollContainerPosition = $scrollContainer.css('position');
                if (scrollContainerPosition === '' || scrollContainerPosition === 'static') {
                    $scrollContainer.css('position', 'relative');
                }
            }
            return $scrollContainer;
        }, function getUpdatedStyles(fixedTop, context) {
            const { $table, $scrollContainer } = context;
            const tableWidth = $table.outerWidth();
            let clipRight, clipPathRight;
            const tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft();
            if (tableVisibleWidth < tableWidth) {
                clipRight = tableVisibleWidth + 'px';
                clipPathRight = tableWidth - tableVisibleWidth + 'px';
            }
            else {
                clipRight = 'auto';
                clipPathRight = '0';
            }
            let clipLeft, clipPathLeft;
            const tableInvisibleLeft = $scrollContainer.scrollLeft() - $table[0].offsetLeft;
            if (tableInvisibleLeft > 0) {
                clipLeft = tableInvisibleLeft + 'px';
                clipPathLeft = tableInvisibleLeft + 'px';
            }
            else {
                clipLeft = 'auto';
                clipPathLeft = '0';
            }
            return {
                'top': Math.round($scrollContainer.offset().top - $win.scrollTop() + fixedTop) + 'px',
                'left': $table.offset().left - $win.scrollLeft() + 'px',
                'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
                'clip-path': 'inset(0 ' + clipPathRight + ' 0 ' + clipPathLeft + ')'
            };
        }, function bindScrollEventHandler(handler, context) {
            const { $scrollContainer } = context;
            $win.on('scroll', handler);
            $win.on('resize', handler);
            $scrollContainer.on('scroll', handler);
            $scrollContainer.on('resize', handler);
        });
    });
    return this;
}
export default tableFixedHeader;
