import $ from 'jquery';
import defaultOptions from '../default/container-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import getFixedTop from '../utility/get-fixed-top';
import findHeader from '../utility/find-header';
import cloneTableHeadersOnly from '../utility/clone-table-headers-only';
import syncWidth from '../utility/sync-width';
import defaultClonedStyle from '../default/cloned-style';

function containerTableFixedHeader(this: JQuery, customOptions?: JQueryTableFixedHeader.Options) {
	const options = $.extend({}, defaultOptions, this.data(), customOptions);
	normalizeOptions(options);

	const {
		fixedTop: fixedTopOption,
		fixedClass: fixedClassOption
	} = options;

	const $win = $(window);

	getUnprocessedTables(this, fixedClassOption).each(function (index, element) {
		const $table = $(element);

		const $headerRows = findHeader($table, options.headerRows);
		if (!$headerRows.length) {
			return;
		}
		const $headerRowGroups = $headerRows.parent();

		let $tableCloned = $table.data('cloned');
		if ($tableCloned) {
			const $tableClonedNew = cloneTableHeadersOnly($table, options.headerRows);
			$tableCloned.empty().append($tableClonedNew.children());
			syncWidth($tableCloned.children(), $headerRowGroups);
		}
		else {
			const $scrollContainer = $table.closest(options.scrollContainer).eq(0);
			if (!$scrollContainer.length) {
				return;
			}
			if ($scrollContainer.css('position') === '' || $scrollContainer.css('position') === 'static') {
				$scrollContainer.css('position', 'relative');
			}

			$tableCloned = cloneTableHeadersOnly($table, options.headerRows);
			$tableCloned.addClass(options.fixedClass);
			$tableCloned.css(defaultClonedStyle);

			$table.data('cloned', $tableCloned);
			$table.after($tableCloned);

			$table.data('positioning', false);
			const scrollHandler = function () {
				if (!$table.is(':visible') || $table.data('positioning')) {
					return;
				}
				$table.data('positioning', true);
				syncWidth($tableCloned.children(), $headerRowGroups);

				const fixedTop = getFixedTop(fixedTopOption);
				const scrollTop = $scrollContainer.scrollTop()!;
				const visibleTop = scrollTop + fixedTop;
				const headersTop = $table[0].offsetTop;
				if ((visibleTop >= headersTop) && (visibleTop + ($tableCloned.outerHeight()!) <= headersTop + $table.outerHeight()!)) {
					const tableWidth = $table.outerWidth()!;

					let clipRight, clipPathRight;
					const tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft()!;
					if (tableVisibleWidth < tableWidth) {
						clipRight = tableVisibleWidth + 'px';
						clipPathRight = tableWidth - tableVisibleWidth + 'px';
					}
					else {
						clipRight = 'auto';
						clipPathRight = '0';
					}

					let clipLeft, clipPathLeft;
					const tableInvisibleLeft = $scrollContainer.scrollLeft()! - $table[0].offsetLeft;
					if (tableInvisibleLeft > 0) {
						clipLeft = tableInvisibleLeft + 'px';
						clipPathLeft = tableInvisibleLeft + 'px';
					}
					else {
						clipLeft = 'auto';
						clipPathLeft = '0';
					}

					$tableCloned.css({
						'top': Math.round($scrollContainer.offset()!.top - $win.scrollTop()! + fixedTop) + 'px',
						'left': $table.offset()!.left - $win.scrollLeft()! + 'px',
						'clip': 'rect(auto ' + clipRight + ' auto ' + clipLeft + ')',
						'clip-path': 'inset(0 ' + clipPathRight + ' 0 ' + clipPathLeft + ')',
						'visibility': 'visible'
					});
				} else {
					$tableCloned.css('visibility', 'hidden');
				}
				$table.data('positioning', false);
			};
			$scrollContainer.scroll(scrollHandler);
			$win.scroll(scrollHandler);
			$win.resize(scrollHandler);

			scrollHandler();
		}
	});

	return this;
}

export default containerTableFixedHeader;