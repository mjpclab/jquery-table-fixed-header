import $ from 'jquery';
import defaultOptions from '../default/regular-options';
import normalizeOptions from '../utility/normalize-options';
import getUnprocessedTables from '../utility/get-unprocessed-tables';
import getFixedTop from '../utility/get-fixed-top';
import findHeader from '../utility/find-header';
import cloneTableHeadersOnly from '../utility/clone-table-headers-only';
import syncWidth from '../utility/sync-width';

const $win = $(window);

function regularTableFixedHeader(this: JQuery, customOptions?: JQueryTableFixedHeader.Options) {
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
		const $scrollContainer = $win;

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
				$tableCloned.css({
					'top': fixedTop + 'px',
					'left': $table.offset()!.left - $win.scrollLeft()! + 'px',
					'visibility': 'visible'
				});
			} else {
				$tableCloned.css('visibility', 'hidden');
			}

			positioning = false;
		};

		//bind events
		$win.on('scroll', scrollHandler);
		$win.on('resize', scrollHandler);
		scrollHandler();

	});

	return this;
}

export default regularTableFixedHeader;