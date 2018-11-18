import $ from 'jquery';
import { isIE7, isIE8 } from './browser-check';
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
export default syncWidth;
