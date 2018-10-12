(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
    typeof define === 'function' && define.amd ? define(['jquery'], factory) :
    (global['jquery-table-fixed-header'] = factory(global.jQuery));
}(this, (function ($) { 'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    var isIE6 = Boolean(window.ActiveXObject && !window.XMLHttpRequest);
    var isIE7 = Boolean(window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);
    var isIE8 = Boolean(window.ActiveXObject && window.XMLHttpRequest && document.documentMode && !window.XMLSerializer);
    var getActualWidth = window.getComputedStyle ? function ($element) {
      var width = window.getComputedStyle($element[0]).width;
      return parseFloat(width);
    } : isIE7 ? function ($element) {
      var borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
      var borderRightWidth = parseInt($element.css('border-right-width')) || 0;
      return $element.width() + (borderLeftWidth + borderRightWidth) / 2;
    } : function ($element) {
      return $element.width();
    };
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
    var syncTableWidth = isIE7 || isIE8 ? function ($clonedTable, $originalTable) {
      $clonedTable.width($originalTable.outerWidth());
    } : function ($clonedTable, $originalTable) {
      $clonedTable.width(getActualWidth($originalTable));
    };
    function syncWidth($clonedRowGroups, $originalRowGroups) {
      $clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
        var $clonedRowGroup = $(clonedRowGroup);
        var $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
        syncTableWidth($clonedRowGroup.parent(), $originalRowGroup.parent());
        $clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
          var $clonedRow = $(clonedRow);
          var $originalRow = $originalRowGroup.children().eq(clonedRowIndex);
          $clonedRow.children().each(function (clonedCellIndex, clonedCell) {
            var $clonedCell = $(clonedCell);
            var $originalCell = $originalRow.children().eq(clonedCellIndex);
            $clonedCell.width(getActualWidth($originalCell));
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
      var defaultOptions = {
        headerRows: 1,
        fixedClass: 'table-fixed-header',
        fixedTop: 0
      };
      var options = $.extend({}, defaultOptions, this.data(), customOptions);

      if (typeof options.fixedTop !== 'function') {
        options.fixedTop = parseInt(options.fixedTop);
      }

      var $win = $(window);

      var getFixedTop = function getFixedTop() {
        return typeof options.fixedTop === 'function' ? options.fixedTop() : options.fixedTop;
      };

      this.filter('table:not(.' + options.fixedClass + ')').each(function (index, element) {
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
          var $scrollContainer = $win;
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
            var fixedTop = getFixedTop();
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

    function containerTableFixedHeader(customOptions) {
      var defaultOptions = {
        headerRows: 1,
        fixedClass: 'container-table-fixed-header',
        fixedTop: 0,
        scrollContainer: ''
      };
      var options = $.extend({}, defaultOptions, this.data(), customOptions);

      if (typeof options.fixedTop !== 'function') {
        options.fixedTop = parseInt(options.fixedTop);
      }

      var $win = $(window);

      var getFixedTop = function getFixedTop() {
        return typeof options.fixedTop === 'function' ? options.fixedTop() : options.fixedTop;
      };

      this.filter('table:not(.' + options.fixedClass + ')').each(function (index, element) {
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
            var fixedTop = getFixedTop();
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

    $('table.fixed-header').tableFixedHeader();

    return $;

})));
