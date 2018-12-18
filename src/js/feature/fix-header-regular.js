import $ from 'jquery';
import defaultOptions from '../default/regular-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import FixHeader from './fix-header';
var $win = $(window);
function tableFixedHeader(customOptions) {
    var options = $.extend({}, defaultOptions, this.data(), customOptions);
    normalizeOptions(options);
    getUnprocessedTables(this, options.fixedClass).each(function (index, table) {
        FixHeader(table, options, function getScrollContainer() {
            return $win;
        }, function getUpdatedStyles(fixedTop, context) {
            var $table = context.$table, $scrollContainer = context.$scrollContainer;
            return {
                'top': fixedTop + 'px',
                'left': $table.offset().left - $scrollContainer.scrollLeft() + 'px'
            };
        }, function bindScrollEventHandler(handler, context) {
            var $scrollContainer = context.$scrollContainer;
            $scrollContainer.on('scroll', handler);
            $scrollContainer.on('resize', handler);
        });
    });
    return this;
}
export default tableFixedHeader;
