import $ from 'jquery';
import defaultOptions from '../default/regular-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import FixHeader from './fix-header';
const $win = $(window);
function tableFixedHeader(customOptions) {
    const options = $.extend({}, defaultOptions, this.data(), customOptions);
    normalizeOptions(options);
    getUnprocessedTables(this, options.fixedClass).each(function (index, table) {
        FixHeader(table, options, function getScrollContainer() {
            return $win;
        }, function getUpdatedStyles(fixedTop, context) {
            const { $table, $scrollContainer } = context;
            return {
                'top': fixedTop + 'px',
                'left': $table.offset().left - $scrollContainer.scrollLeft() + 'px'
            };
        }, function bindScrollEventHandler(handler, context) {
            const { $scrollContainer } = context;
            $scrollContainer.on('scroll', handler);
            $scrollContainer.on('resize', handler);
        });
    });
    return this;
}
export default tableFixedHeader;
