import * as $ from 'jquery';
import * as utility from './utility';

function regularTableFixedHeader(this: JQuery, customOptions?: JQueryTableFixedHeaderOptions) {
	const defaultOptions: JQueryTableFixedHeaderOptions = {
		headerRows: 1,
		fixedClass: 'table-fixed-header',
		fixedTop: 0
	};

	const options = $.extend({}, defaultOptions, this.data(), customOptions) as _JQueryTableFixedHeaderOptions;
	if (typeof (options.fixedTop) !== 'function') {
		options.fixedTop = parseInt(options.fixedTop);
	}

	const $win = $(window);

	const getFixedTop = function () {
		return typeof (options.fixedTop) === 'function' ? options.fixedTop() : options.fixedTop;
	};

	this.filter('table:not(.' + options.fixedClass + ')').each(function (index, element) {
		const $table = $(element);

		const $headerRows = utility.findHeader($table, options.headerRows);
		if (!$headerRows.length) {
			return;
		}
		const $headerRowGroups = $headerRows.parent();

		let $tableCloned = $table.data('cloned');
		if ($tableCloned) {
			const $tableClonedNew = utility.cloneTableHeadersOnly($table, options.headerRows);
			$tableCloned.empty().append($tableClonedNew.children());
			utility.syncWidth($tableCloned.children(), $headerRowGroups);
		}
		else {
			const $scrollContainer = $win;

			$tableCloned = utility.cloneTableHeadersOnly($table, options.headerRows);
			$tableCloned.addClass(options.fixedClass);
			$tableCloned.css(utility.defaultClonedStyle);

			$table.data('cloned', $tableCloned);
			$table.after($tableCloned);

			$table.data('positioning', false);
			const scrollHandler = function () {
				if (!$table.is(':visible') || $table.data('positioning')) {
					return;
				}
				$table.data('positioning', true);
				utility.syncWidth($tableCloned.children(), $headerRowGroups);

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
			};
			$win.scroll(scrollHandler);
			$win.resize(scrollHandler);

			scrollHandler();
		}
	});

	return this;
}

export {regularTableFixedHeader}
export default regularTableFixedHeader;