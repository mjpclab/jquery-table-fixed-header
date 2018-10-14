import $ from 'jquery';
import defaultOptions from '../default/container-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import getFixedTop from '../utility/get-fixed-top';
import findHeader from '../utility/find-header';
import cloneTableHeadersOnly from '../utility/clone-table-headers-only';
import syncWidth from '../utility/sync-width';

const $win = $(window);

function containerTableFixedHeader(this: JQuery, customOptions?: JQueryTableFixedHeader.Options) {
	const options = $.extend({}, defaultOptions, this.data(), customOptions);
	normalizeOptions(options);

	const {
		fixedTop: fixedTopOption,
		fixedClass: fixedClassOption
	} = options;

	getUnprocessedTables(this, fixedClassOption).each(function (index, element) {
		const $table = $(element);

		//header rows
		const $headerRows = findHeader($table, options.headerRows);
		if (!$headerRows.length) {
			return;
		}
		const $headerRowGroups = $headerRows.parent();

		//scroll container
		const $scrollContainer = $table.closest(options.scrollContainer).eq(0);
		if (!$scrollContainer.length) {
			return;
		}
		const scrollContainerPosition = $scrollContainer.css('position');
		if (scrollContainerPosition === '' || scrollContainerPosition === 'static') {
			$scrollContainer.css('position', 'relative');
		}

		//cloned
		const $tableCloned = cloneTableHeadersOnly($table, options);
		$table.after($tableCloned);

		//scroll handler
		let positioning = false;
		const scrollHandler = function () {
			if (positioning || $table.is(':hidden')) {
				return;
			}
			positioning = true;
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
			positioning = false;
		};

		//bind events
		$win.on('scroll', scrollHandler);
		$scrollContainer.on('scroll', scrollHandler);
		$scrollContainer.on('resize', scrollHandler);
		scrollHandler();

	});

	return this;
}

export default containerTableFixedHeader;