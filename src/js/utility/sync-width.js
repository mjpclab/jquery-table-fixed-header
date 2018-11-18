import $ from 'jquery';
import { isIE7, isIE8 } from './browser-check';
const _getActualWidth = window.getComputedStyle ? function ($element) {
    const width = window.getComputedStyle($element[0]).width;
    return parseFloat(width);
} : isIE7 ? function ($element) {
    const borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
    const borderRightWidth = parseInt($element.css('border-right-width')) || 0;
    return $element.width() + (borderLeftWidth + borderRightWidth) / 2;
} : function ($element) {
    return $element.width();
};
const _syncTableWidth = (isIE7 || isIE8) ? function ($clonedTable, $originalTable) {
    $clonedTable.width($originalTable.outerWidth());
} : function ($clonedTable, $originalTable) {
    $clonedTable.width($originalTable.width());
};
function syncWidth($clonedRowGroups, $originalRowGroups) {
    $clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
        const $clonedRowGroup = $(clonedRowGroup);
        const $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
        _syncTableWidth($clonedRowGroup.parent(), $originalRowGroup.parent());
        $clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
            const $clonedRow = $(clonedRow);
            const $originalRow = $originalRowGroup.children().eq(clonedRowIndex);
            $clonedRow.children().each(function (clonedCellIndex, clonedCell) {
                const $clonedCell = $(clonedCell);
                const $originalCell = $originalRow.children().eq(clonedCellIndex);
                $clonedCell.width(_getActualWidth($originalCell));
            });
        });
    });
}
export default syncWidth;
