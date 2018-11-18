(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
    typeof define === 'function' && define.amd ? define(['jquery'], factory) :
    (global['jquery-table-fixed-header'] = factory(global.jQuery));
}(this, (function ($) { 'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    var isIE6 = Boolean(window.ActiveXObject &&
        !window.XMLHttpRequest);
    var isIE7 = Boolean(window.ActiveXObject &&
        window.XMLHttpRequest &&
        !document.documentMode);
    var isIE8 = Boolean(window.ActiveXObject &&
        window.XMLHttpRequest &&
        document.documentMode &&
        !window.XMLSerializer);

    var options = {
        headerRows: 1,
        fixedClass: 'table-fixed-header regular-table-fixed-header',
        fixedTop: 0
    };

    function normalizeOptions(options) {
        if (typeof options.fixedTop !== 'function') {
            options.fixedTop = parseInt(options.fixedTop);
        }
    }

    var RE_WHITESPACES = /\s+/g;
    var SPACE = ' ';
    var CLASS_PREFIX = '.';
    function convertCssClassToSelector(classNames) {
        return (SPACE + classNames).replace(RE_WHITESPACES, CLASS_PREFIX);
    }

    function getUnprocessedTables($collection, fixedClass) {
        var fixedClassSelector = convertCssClassToSelector(fixedClass);
        return $collection.filter("table:not(" + fixedClassSelector + ")");
    }

    function getFixedTop(value) {
        return typeof value === 'function' ? value() : value;
    }

    function findHeader($table, headerRows) {
        return $table.find('tr:lt(' + headerRows + ')');
    }

    var defaultClonedStyles = ({
        'margin': '0',
        'padding': '0',
        'table-layout': 'fixed',
        'visibility': 'hidden',
        'position': 'fixed'
    });

    function cloneTableHeadersOnly($table, options) {
        var headerRows = options.headerRows, fixedClass = options.fixedClass;
        var $tableCloned = $table.clone();
        var $headerRowsCloned = findHeader($tableCloned, headerRows);
        var $headerRowGroupsCloned = $headerRowsCloned.parent();
        $tableCloned.find('tr').not($headerRowsCloned).remove();
        $tableCloned.children().not($headerRowGroupsCloned).remove();
        $tableCloned.removeAttr('id').find('[id]').removeAttr('id');
        $tableCloned.addClass(fixedClass);
        $tableCloned.css(defaultClonedStyles);
        return $tableCloned;
    }

    var _getActualWidth = window.getComputedStyle ? function ($element) {
        var width = window.getComputedStyle($element[0]).width;
        return parseFloat(width);
    } : isIE7 ? function ($element) {
        var borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
        var borderRightWidth = parseInt($element.css('border-right-width')) || 0;
        return $element.width() + (borderLeftWidth + borderRightWidth) / 2;
    } : function ($element) {
        return $element.width();
    };
    var _syncTableWidth = (isIE7 || isIE8) ? function ($clonedTable, $originalTable) {
        $clonedTable.width($originalTable.outerWidth());
    } : function ($clonedTable, $originalTable) {
        $clonedTable.width($originalTable.width());
    };
    function syncWidth($clonedRowGroups, $originalRowGroups) {
        $clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
            var $clonedRowGroup = $(clonedRowGroup);
            var $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
            _syncTableWidth($clonedRowGroup.parent(), $originalRowGroup.parent());
            $clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
                var $clonedRow = $(clonedRow);
                var $originalRow = $originalRowGroup.children().eq(clonedRowIndex);
                $clonedRow.children().each(function (clonedCellIndex, clonedCell) {
                    var $clonedCell = $(clonedCell);
                    var $originalCell = $originalRow.children().eq(clonedCellIndex);
                    $clonedCell.width(_getActualWidth($originalCell));
                });
            });
        });
    }

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

    var $win = $(window);
    function tableFixedHeader(customOptions) {
        var options$$1 = $.extend({}, options, this.data(), customOptions);
        normalizeOptions(options$$1);
        getUnprocessedTables(this, options$$1.fixedClass).each(function (index, table) {
            FixHeader(table, options$$1, function getScrollContainer() {
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

    var options$1 = {
        headerRows: 1,
        fixedClass: 'table-fixed-header container-table-fixed-header',
        fixedTop: 0,
        scrollContainer: ''
    };

    var $win$1 = $(window);
    function tableFixedHeader$1(customOptions) {
        var options = $.extend({}, options$1, this.data(), customOptions);
        normalizeOptions(options);
        getUnprocessedTables(this, options.fixedClass).each(function (index, table) {
            FixHeader(table, options, function getScrollContainer(context) {
                var $table = context.$table, options = context.options;
                var $scrollContainer = $table.closest(options.scrollContainer).eq(0);
                if ($scrollContainer.length) {
                    var scrollContainerPosition = $scrollContainer.css('position');
                    if (scrollContainerPosition === '' || scrollContainerPosition === 'static') {
                        $scrollContainer.css('position', 'relative');
                    }
                }
                return $scrollContainer;
            }, function getUpdatedStyles(fixedTop, context) {
                var $table = context.$table, $scrollContainer = context.$scrollContainer;
                var tableWidth = $table.outerWidth();
                var clipRight, clipPathRight;
                var tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft();
                if (tableVisibleWidth < tableWidth) {
                    clipRight = tableVisibleWidth + 'px';
                    clipPathRight = tableWidth - tableVisibleWidth + 'px';
                }
                else {
                    clipRight = 'auto';
                    clipPathRight = '0';
                }
                var clipLeft, clipPathLeft;
                var tableInvisibleLeft = $scrollContainer.scrollLeft() - $table[0].offsetLeft;
                if (tableInvisibleLeft > 0) {
                    clipLeft = tableInvisibleLeft + 'px';
                    clipPathLeft = tableInvisibleLeft + 'px';
                }
                else {
                    clipLeft = 'auto';
                    clipPathLeft = '0';
                }
                return {
                    'top': Math.round($scrollContainer.offset().top - $win$1.scrollTop() + fixedTop) + 'px',
                    'left': $table.offset().left - $win$1.scrollLeft() + 'px',
                    'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
                    'clip-path': 'inset(0 ' + clipPathRight + ' 0 ' + clipPathLeft + ')'
                };
            }, function bindScrollEventHandler(handler, context) {
                var $scrollContainer = context.$scrollContainer;
                $win$1.on('scroll', handler);
                $win$1.on('resize', handler);
                $scrollContainer.on('scroll', handler);
                $scrollContainer.on('resize', handler);
            });
        });
        return this;
    }

    function autoEnableTableFixedHeader() {
        $('table.fixed-header').tableFixedHeader();
    }

    /// <reference path='./type/public.d.ts' />
    $.fn.tableFixedHeader = function (customOptions) {
        if (isIE6) {
            return this;
        }
        else if (customOptions && customOptions.scrollContainer) {
            return tableFixedHeader$1.call(this, customOptions);
        }
        else {
            return tableFixedHeader.call(this, customOptions);
        }
    };
    autoEnableTableFixedHeader();

    return $;

})));
