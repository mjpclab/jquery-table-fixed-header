import $ from 'jquery';
function _syncTableWidth($clonedTable, $originalTable) {
    $clonedTable.css('width', $originalTable.outerWidth());
}
function _getActualWidth($clonedCell, $originalCell) {
    var width = $originalCell[0].clientWidth;
    var style = getComputedStyle($clonedCell[0]);
    width = width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    return width;
}
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
                $clonedCell.width(_getActualWidth($clonedCell, $originalCell));
            });
        });
    });
}
export default syncWidth;
