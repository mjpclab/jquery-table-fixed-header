import * as $ from 'jquery';
import * as utility from './utility';

function containerTableFixedHeader(this: JQuery, customOptions?: IJQueryTableFixedHeaderOptions) {
	const defaultOptions: IJQueryTableFixedHeaderOptions = {
		headerRows: 1,
		fixedClass: 'container-table-fixed-header',
		fixedTop: 0,
		scrollContainer: ''
	};

	const options = $.extend({}, defaultOptions, customOptions) as IJQueryTableFixedHeaderOptions;
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

	this.filter('table').each(function (index, element) {
		const $table = $(element);

		const $scrollContainer = $table.closest(options.scrollContainer!).eq(0);
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
		$tableCloned.css(utility.defaultClonedStyle);

		$table.after($tableCloned);

		$table.data('positioning', false);
		const scrollHandler = function () {
			if (!$table.data('positioning')) {
				$table.data('positioning', true);
				utility.syncWidth($headerRowGroupsCloned, $headerRowGroups);

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

export { containerTableFixedHeader }
export default containerTableFixedHeader;