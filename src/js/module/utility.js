"use strict";
exports.__esModule = true;
var $ = require("jquery");
exports.isIE6 = Boolean(window.ActiveXObject && !window.XMLHttpRequest);
exports.isIE7 = Boolean(window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);
exports.isIE8 = Boolean(window.ActiveXObject && window.XMLHttpRequest && document.documentMode && !window.XMLSerializer);
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
var syncTableWidth = (exports.isIE7 || exports.isIE8) ? function ($clonedTable, $originalTable) {
    $clonedTable.width($originalTable.outerWidth());
} : function ($clonedTable, $originalTable) {
    $clonedTable.width(exports.getActualWidth($originalTable));
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
