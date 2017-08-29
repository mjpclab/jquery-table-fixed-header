import $ = require('jquery');

$.fn.tableFixedHeader = function (customOptions: IJQueryTableFixedHeaderOptions) {
	const isIE6 = (window.ActiveXObject && !window.XMLHttpRequest);
	if (isIE6) {
		return this;
	}
	const isIE7 = (window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);

	const defaultOptions: IJQueryTableFixedHeaderOptions = {
		headerRows: 1,
		fixedClass: 'table-fixed-header',
		fixedTop: 0
	};

	const options = $.extend({}, defaultOptions, customOptions);
	if (typeof (options.fixedTop) !== 'function') {
		options.fixedTop = parseInt(options.fixedTop);
	}

	const $win = $(window);

	const getFixedTop = function () {
		return typeof (options.fixedTop) === 'function' ? options.fixedTop() : options.fixedTop;
	};

	const findHeader = function ($table: JQuery) {
		return $table.find('tr:lt(' + options.headerRows + ')');
	};

	const getActualWidth = window.getComputedStyle ? function ($element: JQuery) {
		const width = window.getComputedStyle($element[0]).width;
		return parseFloat(width!);
	} : isIE7 ? function ($element: JQuery) {
		const borderLeftWidth = parseInt($element.css('border-left-width')) || 0;
		const borderRightWidth = parseInt($element.css('border-right-width')) || 0;

		return $element.width()! + (borderLeftWidth + borderRightWidth) / 2;
	} : function ($element: JQuery) {
		return $element.width()!;
	};

	const syncWidth = function ($clonedRowGroups: JQuery, $originalRowGroups: JQuery) {
		$clonedRowGroups.each(function (rowGroupIndex: number, clonedRowGroup: HTMLElement) {
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
	};

	this.filter('table').each(function (index, element) {
		const $table = $(element);

		const $headerRows = findHeader($table);
		if (!$headerRows.length) {
			return;
		}

		const $headerRowGroups = $headerRows.parent();

		const $tableCloned = $table.clone();
		const $headerRowsCloned = findHeader($tableCloned);
		const $headerRowGroupsCloned = $headerRowsCloned.parent();

		$tableCloned.find('tr').not($headerRowsCloned).remove();
		$tableCloned.children().not($headerRowGroupsCloned).remove();

		$tableCloned.addClass(options.fixedClass).removeAttr('id').find('[id]').removeAttr('id');
		$tableCloned.css({
			'margin': '0',
			'padding': '0',
			'table-layout': 'fixed',
			'visibility': 'hidden',
			'position': 'fixed'
		});

		$table.after($tableCloned);

		$table.data('positioning', false);
		const scrollHandler = function () {
			if (!$table.data('positioning')) {
				$table.data('positioning', true);
				syncWidth($headerRowGroupsCloned, $headerRowGroups);

				const fixedTop = getFixedTop();
				const scrollTop = $win.scrollTop()!;
				const visibleTop = scrollTop + fixedTop;
				const headersTop = $table.offset()!.top;
				if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()!) <= headersTop + $table.outerHeight()!)) {
					$tableCloned.css({
						'top': fixedTop + 'px',
						'left': $table.offset()!.left - $win.scrollLeft()! + 'px',
						'visibility': 'visible'
					});
				} else {
					$tableCloned.css('visibility', 'hidden');
				}

				$table.data('positioning', false);
			}
		};
		$win.scroll(scrollHandler);
		$win.resize(scrollHandler);

		scrollHandler();
	});

	return this;
};

export = $;
