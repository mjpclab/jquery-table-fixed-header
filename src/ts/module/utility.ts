export const isIE6 = Boolean(window.ActiveXObject && !window.XMLHttpRequest);

export const isIE7 = Boolean(window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);

export const getActualWidth = window.getComputedStyle ? function ($element: JQuery) {
	const width = window.getComputedStyle($element[0]).width;
	return parseFloat(width!);
} : isIE7 ? function ($element: JQuery) {
	const borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
	const borderRightWidth = parseInt($element.css('border-right-width')) || 0;

	return $element.width()! + (borderLeftWidth + borderRightWidth) / 2;
} : function ($element: JQuery) {
	return $element.width()!;
};

export function findHeader($table: JQuery, headerRows: number) {
	return $table.find('tr:lt(' + headerRows + ')');
}

export function cloneTableHeadersOnly($table: JQuery, headerRows: number) {
	const $tableCloned = $table.clone();
	const $headerRowsCloned = findHeader($tableCloned, headerRows);
	const $headerRowGroupsCloned = $headerRowsCloned.parent();

	$tableCloned.find('tr').not($headerRowsCloned).remove();
	$tableCloned.children().not($headerRowGroupsCloned).remove();

	$tableCloned.removeAttr('id').find('[id]').removeAttr('id');

	return $tableCloned;
}

export function syncWidth($clonedRowGroups: JQuery, $originalRowGroups: JQuery) {
	$clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
		const $clonedRowGroup = $(clonedRowGroup);
		const $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
		$clonedRowGroup.parent().width($originalRowGroup.parent().outerWidth()!);

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