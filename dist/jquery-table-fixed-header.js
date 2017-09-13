(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["jquery-table-fixed-header"] = factory(require("jquery"));
	else
		root["jquery-table-fixed-header"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var $ = __webpack_require__(0);
exports.isIE6 = Boolean(window.ActiveXObject && !window.XMLHttpRequest);
exports.isIE7 = Boolean(window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);
exports.getActualWidth = window.getComputedStyle ? function ($element) {
    var width = window.getComputedStyle($element[0]).width;
    return parseFloat(width);
} : exports.isIE7 ? function ($element) {
    var borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
    var borderRightWidth = parseInt($element.css('border-right-width')) || 0;
    return $element.width() + (borderLeftWidth + borderRightWidth) / 2;
} : function ($element) {
    return $element.width();
};
function findHeader($table, headerRows) {
    return $table.find('tr:lt(' + headerRows + ')');
}
exports.findHeader = findHeader;
function cloneTableHeadersOnly($table, headerRows) {
    var $tableCloned = $table.clone();
    var $headerRowsCloned = findHeader($tableCloned, headerRows);
    var $headerRowGroupsCloned = $headerRowsCloned.parent();
    $tableCloned.find('tr').not($headerRowsCloned).remove();
    $tableCloned.children().not($headerRowGroupsCloned).remove();
    $tableCloned.removeAttr('id').find('[id]').removeAttr('id');
    return $tableCloned;
}
exports.cloneTableHeadersOnly = cloneTableHeadersOnly;
function syncWidth($clonedRowGroups, $originalRowGroups) {
    $clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
        var $clonedRowGroup = $(clonedRowGroup);
        var $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
        $clonedRowGroup.parent().width($originalRowGroup.parent().outerWidth());
        $clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
            var $clonedRow = $(clonedRow);
            var $originalRow = $originalRowGroup.children().eq(clonedRowIndex);
            $clonedRow.children().each(function (clonedCellIndex, clonedCell) {
                var $clonedCell = $(clonedCell);
                var $originalCell = $originalRow.children().eq(clonedCellIndex);
                $clonedCell.width(exports.getActualWidth($originalCell));
            });
        });
    });
}
exports.syncWidth = syncWidth;
exports.defaultClonedStyle = {
    'margin': '0',
    'padding': '0',
    'table-layout': 'fixed',
    'visibility': 'hidden',
    'position': 'fixed'
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(0);
var utility = __webpack_require__(1);
var regular_1 = __webpack_require__(3);
var container_1 = __webpack_require__(4);
$.fn.tableFixedHeader = function (customOptions) {
    if (utility.isIE6) {
        return this;
    }
    else if (customOptions && customOptions.scrollContainer) {
        return container_1["default"].call(this, customOptions);
    }
    else {
        return regular_1["default"].call(this, customOptions);
    }
};
module.exports = $;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var $ = __webpack_require__(0);
var utility = __webpack_require__(1);
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
    this.filter('table:not(.' + options.fixedClass + ')').each(function (index, element) {
        var $table = $(element);
        var $headerRows = utility.findHeader($table, options.headerRows);
        if (!$headerRows.length) {
            return;
        }
        var $headerRowGroups = $headerRows.parent();
        var $tableCloned = $table.data('cloned');
        if ($tableCloned) {
            var $tableClonedNew = utility.cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.empty().append($tableClonedNew.children());
            utility.syncWidth($tableCloned.children(), $headerRowGroups);
        }
        else {
            var $scrollContainer_1 = $win;
            $tableCloned = utility.cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.addClass(options.fixedClass);
            $tableCloned.css(utility.defaultClonedStyle);
            $table.data('cloned', $tableCloned);
            $table.after($tableCloned);
            $table.data('positioning', false);
            var scrollHandler = function () {
                if (!$table.is(':visible') || $table.data('positioning')) {
                    return;
                }
                $table.data('positioning', true);
                utility.syncWidth($tableCloned.children(), $headerRowGroups);
                var fixedTop = getFixedTop();
                var scrollTop = $scrollContainer_1.scrollTop();
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
            };
            $win.scroll(scrollHandler);
            $win.resize(scrollHandler);
            scrollHandler();
        }
    });
    return this;
}
exports.regularTableFixedHeader = regularTableFixedHeader;
exports["default"] = regularTableFixedHeader;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var $ = __webpack_require__(0);
var utility = __webpack_require__(1);
function containerTableFixedHeader(customOptions) {
    var defaultOptions = {
        headerRows: 1,
        fixedClass: 'container-table-fixed-header',
        fixedTop: 0,
        scrollContainer: ''
    };
    var options = $.extend({}, defaultOptions, customOptions);
    if (typeof (options.fixedTop) !== 'function') {
        options.fixedTop = parseInt(options.fixedTop);
    }
    var $win = $(window);
    var getFixedTop = function () {
        return typeof (options.fixedTop) === 'function' ? options.fixedTop() : options.fixedTop;
    };
    this.filter('table:not(.' + options.fixedClass + ')').each(function (index, element) {
        var $table = $(element);
        var $headerRows = utility.findHeader($table, options.headerRows);
        if (!$headerRows.length) {
            return;
        }
        var $headerRowGroups = $headerRows.parent();
        var $tableCloned = $table.data('cloned');
        if ($tableCloned) {
            var $tableClonedNew = utility.cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.empty().append($tableClonedNew.children());
            utility.syncWidth($tableCloned.children(), $headerRowGroups);
        }
        else {
            var $scrollContainer_1 = $table.closest(options.scrollContainer).eq(0);
            if (!$scrollContainer_1.length) {
                return;
            }
            if ($scrollContainer_1.css('position') === '' || $scrollContainer_1.css('position') === 'static') {
                $scrollContainer_1.css('position', 'relative');
            }
            $tableCloned = utility.cloneTableHeadersOnly($table, options.headerRows);
            $tableCloned.addClass(options.fixedClass);
            $tableCloned.css(utility.defaultClonedStyle);
            $table.data('cloned', $tableCloned);
            $table.after($tableCloned);
            $table.data('positioning', false);
            var scrollHandler = function () {
                if (!$table.is(':visible') || $table.data('positioning')) {
                    return;
                }
                $table.data('positioning', true);
                utility.syncWidth($tableCloned.children(), $headerRowGroups);
                var fixedTop = getFixedTop();
                var scrollTop = $scrollContainer_1.scrollTop();
                var visibleTop = scrollTop + fixedTop;
                var headersTop = $table[0].offsetTop;
                if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()) <= headersTop + $table.outerHeight())) {
                    var clipRight = void 0;
                    var tableVisibleWidth = $scrollContainer_1[0].clientWidth - $table[0].offsetLeft + $scrollContainer_1.scrollLeft();
                    if (tableVisibleWidth < $table.outerWidth()) {
                        clipRight = tableVisibleWidth + 'px';
                    }
                    else {
                        clipRight = 'auto';
                    }
                    var clipLeft = void 0;
                    var tableInvisibleLeft = $scrollContainer_1.scrollLeft() - $table[0].offsetLeft;
                    if (tableInvisibleLeft > 0) {
                        clipLeft = tableInvisibleLeft + 'px';
                    }
                    else {
                        clipLeft = 'auto';
                    }
                    $tableCloned.css({
                        'top': $scrollContainer_1.offset().top - $win.scrollTop() + fixedTop + 'px',
                        'left': $table.offset().left - $win.scrollLeft() + 'px',
                        'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
                        'visibility': 'visible'
                    });
                }
                else {
                    $tableCloned.css('visibility', 'hidden');
                }
                $table.data('positioning', false);
            };
            $scrollContainer_1.scroll(scrollHandler);
            $win.scroll(scrollHandler);
            $win.resize(scrollHandler);
            scrollHandler();
        }
    });
    return this;
}
exports.containerTableFixedHeader = containerTableFixedHeader;
exports["default"] = containerTableFixedHeader;


/***/ })
/******/ ]);
});
//# sourceMappingURL=jquery-table-fixed-header.js.map