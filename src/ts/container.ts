import $ = require('jquery');

$.fn.containerTableFixedHeader = function (customOptions: IJQueryContainerTableFixedHeaderOptions) {
	const isIE6 = (window.ActiveXObject && !window.XMLHttpRequest);
	if (isIE6) {
		return this;
	}
	const isIE7 = (window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);

	const defaultOptions: IJQueryContainerTableFixedHeaderOptions = {
		headerRows: 1,
		fixedClass: 'container-table-fixed-header',
		fixedTop: 0,
		scrollContainer: ''
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
	};

	this.filter('table').each(function (index, element) {
		const $table = $(element);

		const $scrollContainer = $table.closest(options.scrollContainer).eq(0);
		if (!$scrollContainer.length) {
			return;
		}
		if ($scrollContainer.css('position') === '' || $scrollContainer.css('position') === 'static') {
			$scrollContainer.css('position', 'relative');
		}

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
				const scrollTop = $scrollContainer.scrollTop()!;
				const visibleTop = scrollTop + fixedTop;
				const headersTop = $table[0].offsetTop;
				if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()!) <= headersTop + $table.outerHeight()!)) {
					let clipRight;
					const tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft()!;
					if (tableVisibleWidth < $table.outerWidth()!) {
						clipRight = tableVisibleWidth + 'px';
					}
					else {
						clipRight = 'auto';
					}
					let clipLeft;
					const tableInvisibleLeft = $scrollContainer.scrollLeft()! - $table[0].offsetLeft;
					if (tableInvisibleLeft > 0) {
						clipLeft = tableInvisibleLeft + 'px';
					}
					else {
						clipLeft = 'auto';
					}

					$tableCloned.css({
						'top': $scrollContainer.offset()!.top - $win.scrollTop()! + fixedTop + 'px',
						'left': $table.offset()!.left - $win.scrollLeft()! + 'px',
						'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
						'visibility': 'visible'
					});
				} else {
					$tableCloned.css('visibility', 'hidden');
				}
				$table.data('positioning', false);
			}
		};
		$scrollContainer.scroll(scrollHandler);
		$win.scroll(scrollHandler);
		$win.resize(scrollHandler);

		scrollHandler();
	});

	return this;
};

export = $;
