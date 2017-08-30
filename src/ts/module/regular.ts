import * as $ from 'jquery';
import * as utility from './utility';

function regularTableFixedHeader(this: JQuery, customOptions?: IJQueryTableFixedHeaderOptions) {
	const defaultOptions: IJQueryTableFixedHeaderOptions = {
		headerRows: 1,
		fixedClass: 'table-fixed-header',
		fixedTop: 0
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

		const $scrollContainer = $win;

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

export { regularTableFixedHeader }
export default regularTableFixedHeader;