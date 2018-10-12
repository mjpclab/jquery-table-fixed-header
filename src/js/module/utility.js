import $ from 'jquery';
export const isIE6 = Boolean(window.ActiveXObject && !window.XMLHttpRequest);
export const isIE7 = Boolean(window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);
export const isIE8 = Boolean(window.ActiveXObject && window.XMLHttpRequest && document.documentMode && !window.XMLSerializer);
export const getActualWidth = window.getComputedStyle ? function ($element) {
    const width = window.getComputedStyle($element[0]).width;
    return parseFloat(width);
} : isIE7 ? function ($element) {
    const borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
    const borderRightWidth = parseInt($element.css('border-right-width')) || 0;
    return $element.width() + (borderLeftWidth + borderRightWidth) / 2;
} : function ($element) {
    return $element.width();
};
export function findHeader($table, headerRows) {
    return $table.find('tr:lt(' + headerRows + ')');
}
export function cloneTableHeadersOnly($table, headerRows) {
    const $tableCloned = $table.clone();
    const $headerRowsCloned = findHeader($tableCloned, headerRows);
    const $headerRowGroupsCloned = $headerRowsCloned.parent();
    $tableCloned.find('tr').not($headerRowsCloned).remove();
    $tableCloned.children().not($headerRowGroupsCloned).remove();
    $tableCloned.removeAttr('id').find('[id]').removeAttr('id');
    return $tableCloned;
}
const syncTableWidth = (isIE7 || isIE8) ? function ($clonedTable, $originalTable) {
    $clonedTable.width($originalTable.outerWidth());
} : function ($clonedTable, $originalTable) {
    $clonedTable.width(getActualWidth($originalTable));
};
export function syncWidth($clonedRowGroups, $originalRowGroups) {
    $clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
        const $clonedRowGroup = $(clonedRowGroup);
        const $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
        syncTableWidth($clonedRowGroup.parent(), $originalRowGroup.parent());
        $clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
            const $clonedRow = $(clonedRow);
            const $originalRow = $originalRowGroup.children().eq(clonedRowIndex);
            $clonedRow.children().each(function (clonedCellIndex, clonedCell) {
                const $clonedCell = $(clonedCell);
                const $originalCell = $originalRow.children().eq(clonedCellIndex);
                $clonedCell.width(getActualWidth($originalCell));
            });
        });
    });
}
export const defaultClonedStyle = {
    'margin': '0',
    'padding': '0',
    'table-layout': 'fixed',
    'visibility': 'hidden',
    'position': 'fixed'
};
