(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
    typeof define === 'function' && define.amd ? define(['jquery'], factory) :
    (global['jquery-table-fixed-header'] = factory(global.jQuery));
}(this, (function ($) { 'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    var isIE6 = Boolean(window.ActiveXObject && !window.XMLHttpRequest);
    var isIE7 = Boolean(window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);
    var isIE8 = Boolean(window.ActiveXObject && window.XMLHttpRequest && document.documentMode && !window.XMLSerializer);

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
      return $collection.filter("table:not(".concat(fixedClassSelector, ")"));
    }

    function getFixedTop(value) {
      return typeof value === 'function' ? value() : value;
    }

    function findHeader($table, headerRows) {
      return $table.find('tr:lt(' + headerRows + ')');
    }

    function cloneTableHeadersOnly($table, headerRows) {
      var $tableCloned = $table.clone();
      var $headerRowsCloned = findHeader($tableCloned, headerRows);
      var $headerRowGroupsCloned = $headerRowsCloned.parent();
      $tableCloned.find('tr').not($headerRowsCloned).remove();
      $tableCloned.children().not($headerRowGroupsCloned).remove();
      $tableCloned.removeAttr('id').find('[id]').removeAttr('id');
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

    var _doSyncWidth = isIE7 || isIE8 ? function ($clonedTable, $originalTable) {
      $clonedTable.width($originalTable.outerWidth());
    } : function ($clonedTable, $originalTable) {
      $clonedTable.width(_getActualWidth($originalTable));
    };

    function syncWidth($clonedRowGroups, $originalRowGroups) {
      $clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
        var $clonedRowGroup = $(clonedRowGroup);
        var $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);

        _doSyncWidth($clonedRowGroup.parent(), $originalRowGroup.parent());

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

    var defaultClonedStyle = {
      'margin': '0',
      'padding': '0',
      'table-layout': 'fixed',
      'visibility': 'hidden',
      'position': 'fixed'
    };

    function regularTableFixedHeader(customOptions) {
      var options$$1 = $.extend({}, options, this.data(), customOptions);
      normalizeOptions(options$$1);
      var fixedTopOption = options$$1.fixedTop,
          fixedClassOption = options$$1.fixedClass;
      var $win = $(window);
      getUnprocessedTables(this, fixedClassOption).each(function (index, element) {
        var $table = $(element);
        var $headerRows = findHeader($table, options$$1.headerRows);

        if (!$headerRows.length) {
          return;
        }

        var $headerRowGroups = $headerRows.parent();
        var $tableCloned = $table.data('cloned');

        if ($tableCloned) {
          var $tableClonedNew = cloneTableHeadersOnly($table, options$$1.headerRows);
          $tableCloned.empty().append($tableClonedNew.children());
          syncWidth($tableCloned.children(), $headerRowGroups);
        } else {
          var $scrollContainer = $win;
          $tableCloned = cloneTableHeadersOnly($table, options$$1.headerRows);
          $tableCloned.addClass(options$$1.fixedClass);
          $tableCloned.css(defaultClonedStyle);
          $table.data('cloned', $tableCloned);
          $table.after($tableCloned);
          $table.data('positioning', false);

          var scrollHandler = function scrollHandler() {
            if (!$table.is(':visible') || $table.data('positioning')) {
              return;
            }

            $table.data('positioning', true);
            syncWidth($tableCloned.children(), $headerRowGroups);
            var fixedTop = getFixedTop(fixedTopOption);
            var scrollTop = $scrollContainer.scrollTop();
            var visibleTop = scrollTop + fixedTop;
            var headersTop = $table.offset().top;

            if (visibleTop >= headersTop && visibleTop + $tableCloned.outerHeight() <= headersTop + $table.outerHeight()) {
              $tableCloned.css({
                'top': fixedTop + 'px',
                'left': $table.offset().left - $win.scrollLeft() + 'px',
                'visibility': 'visible'
              });
            } else {
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

    var options$1 = {
      headerRows: 1,
      fixedClass: 'table-fixed-header container-table-fixed-header',
      fixedTop: 0,
      scrollContainer: ''
    };

    function containerTableFixedHeader(customOptions) {
      var options = $.extend({}, options$1, this.data(), customOptions);
      normalizeOptions(options);
      var fixedTopOption = options.fixedTop,
          fixedClassOption = options.fixedClass;
      var $win = $(window);
      getUnprocessedTables(this, fixedClassOption).each(function (index, element) {
        var $table = $(element);
        var $headerRows = findHeader($table, options.headerRows);

        if (!$headerRows.length) {
          return;
        }

        var $headerRowGroups = $headerRows.parent();
        var $tableCloned = $table.data('cloned');

        if ($tableCloned) {
          var $tableClonedNew = cloneTableHeadersOnly($table, options.headerRows);
          $tableCloned.empty().append($tableClonedNew.children());
          syncWidth($tableCloned.children(), $headerRowGroups);
        } else {
          var $scrollContainer = $table.closest(options.scrollContainer).eq(0);

          if (!$scrollContainer.length) {
            return;
          }

          if ($scrollContainer.css('position') === '' || $scrollContainer.css('position') === 'static') {
            $scrollContainer.css('position', 'relative');
          }

          $tableCloned = cloneTableHeadersOnly($table, options.headerRows);
          $tableCloned.addClass(options.fixedClass);
          $tableCloned.css(defaultClonedStyle);
          $table.data('cloned', $tableCloned);
          $table.after($tableCloned);
          $table.data('positioning', false);

          var scrollHandler = function scrollHandler() {
            if (!$table.is(':visible') || $table.data('positioning')) {
              return;
            }

            $table.data('positioning', true);
            syncWidth($tableCloned.children(), $headerRowGroups);
            var fixedTop = getFixedTop(fixedTopOption);
            var scrollTop = $scrollContainer.scrollTop();
            var visibleTop = scrollTop + fixedTop;
            var headersTop = $table[0].offsetTop;

            if (visibleTop >= headersTop && visibleTop + $tableCloned.outerHeight() <= headersTop + $table.outerHeight()) {
              var tableWidth = $table.outerWidth();
              var clipRight, clipPathRight;
              var tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft();

              if (tableVisibleWidth < tableWidth) {
                clipRight = tableVisibleWidth + 'px';
                clipPathRight = tableWidth - tableVisibleWidth + 'px';
              } else {
                clipRight = 'auto';
                clipPathRight = '0';
              }

              var clipLeft, clipPathLeft;
              var tableInvisibleLeft = $scrollContainer.scrollLeft() - $table[0].offsetLeft;

              if (tableInvisibleLeft > 0) {
                clipLeft = tableInvisibleLeft + 'px';
                clipPathLeft = tableInvisibleLeft + 'px';
              } else {
                clipLeft = 'auto';
                clipPathLeft = '0';
              }

              $tableCloned.css({
                'top': Math.round($scrollContainer.offset().top - $win.scrollTop() + fixedTop) + 'px',
                'left': $table.offset().left - $win.scrollLeft() + 'px',
                'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
                'clip-path': 'inset(0 ' + clipPathRight + ' 0 ' + clipPathLeft + ')',
                'visibility': 'visible'
              });
            } else {
              $tableCloned.css('visibility', 'hidden');
            }

            $table.data('positioning', false);
          };

          $scrollContainer.scroll(scrollHandler);
          $win.scroll(scrollHandler);
          $win.resize(scrollHandler);
          scrollHandler();
        }
      });
      return this;
    }

    function autoEnableTableFixedHeader() {
      $('table.fixed-header').tableFixedHeader();
    }

    /// <reference path='public.d.ts' />

    $.fn.tableFixedHeader = function (customOptions) {
      if (isIE6) {
        return this;
      } else if (customOptions && customOptions.scrollContainer) {
        return containerTableFixedHeader.call(this, customOptions);
      } else {
        return regularTableFixedHeader.call(this, customOptions);
      }
    };

    autoEnableTableFixedHeader();

    return $;

})));
