import $ from 'jquery';

function _syncTableWidth($clonedTable: JQuery, $originalTable: JQuery) {
	$clonedTable.css('width',$originalTable.outerWidth()!);
}

function _getActualWidth($clonedCell: JQuery, $originalCell: JQuery) {
	let width = $originalCell[0].clientWidth;
	const style = getComputedStyle($clonedCell[0]);
	width = width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
	return width;
}

function syncWidth($clonedRowGroups: JQuery, $originalRowGroups: JQuery) {
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
				$clonedCell.width(_getActualWidth($clonedCell, $originalCell));
			});
		});
	});
}

export default syncWidth;
