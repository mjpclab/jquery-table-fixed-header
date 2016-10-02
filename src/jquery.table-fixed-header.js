jQuery.fn.tableFixedHeader = function (customOptions) {
	"use strict";

	var isIE6 = (window.ActiveXObject && !window.XMLHttpRequest);
	if (isIE6) {
		return this;
	}
	var isIE7 = (window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);

	var $ = jQuery;

	var defaultOptions = {
		headerRows: 1,
		fixedClass: "table-fixed-header",
		fixedTop: 0
	};

	var options = $.extend({}, defaultOptions, customOptions);
	if (typeof(options.fixedTop) !== "function") {
		options.fixedTop = parseInt(options.fixedTop);
	}

	var $win = $(window);

	var getFixedTop = function () {
		return typeof(options.fixedTop) === "function" ? options.fixedTop() : options.fixedTop;
	};

	var findHeader = function ($table) {
		return $table.find("tr:lt(" + options.headerRows + ")");
	};

	var getActualWidth = window.getComputedStyle ? function ($element) {
		return parseFloat(window.getComputedStyle($element[0]).width);
	} : isIE7 ? function ($element) {
		var borderLeftWidth = parseInt($element.css("border-left-width")) || 0;
		var borderRightWidth = parseInt($element.css("border-right-width")) || 0;

		return $element.width() + (borderLeftWidth + borderRightWidth) / 2;
	} : function ($element) {
		return $element.width();
	};

	var syncWidth = function ($clonedRowGroups, $originalRowGroups) {
		$clonedRowGroups.each(function (rowGroupIndex, clonedRowGroup) {
			var $clonedRowGroup = $(clonedRowGroup);
			var $originalRowGroup = $originalRowGroups.eq(rowGroupIndex);
			$clonedRowGroup.parent().width($originalRowGroup.parent().outerWidth());

			$clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
				var $clonedRow = $(clonedRow);
				var $originalRow = $originalRowGroup.children().eq(clonedRowIndex);

				$clonedRow.children().each(function (clonedCellIndex, clonedCell) {
					var $clonedCell = $(clonedCell);
					var $originalCell = $originalRow.children().eq(clonedCellIndex);
					$clonedCell.width(getActualWidth($originalCell));
				});
			});
		});
	};

	this.filter("table").each(function (index, element) {
		var $table = $(element);

		var $headerRows = findHeader($table);
		if (!$headerRows.length) {
			return;
		}

		var $headerRowGroups = $headerRows.parent();

		var $tableCloned = $table.clone();
		var $headerRowsCloned = findHeader($tableCloned);
		var $headerRowGroupsCloned = $headerRowsCloned.parent();

		$tableCloned.find("tr").not($headerRowsCloned).remove();
		$tableCloned.children().not($headerRowGroupsCloned).remove();

		$tableCloned.addClass(options.fixedClass).removeAttr("id").find("[id]").removeAttr("id");
		$tableCloned.css({
			"margin": "0",
			"padding": "0",
			"table-layout": "fixed",
			"visibility": "hidden",
			"position": "fixed"
		});

		$table.after($tableCloned);

		$table.data("positioning", false);
		var scrollHandler = function () {
			if (!$table.data("positioning")) {
				$table.data("positioning", true);
				syncWidth($headerRowGroupsCloned, $headerRowGroups);

				var fixedTop = getFixedTop();
				var scrollTop = $win.scrollTop();
				var visibleTop = scrollTop + fixedTop;
				var headersTop = $table.offset().top;
				if ((visibleTop >= headersTop) && (visibleTop + $tableCloned.outerHeight() <= headersTop + $table.outerHeight())) {
					$tableCloned.css({
						"top": fixedTop + "px",
						"left": $table.offset().left - $win.scrollLeft() + "px",
						"visibility": "visible"
					});
				} else {
					$tableCloned.css("visibility", "hidden");
				}

				$table.data("positioning", false);
			}
		};
		$win.scroll(scrollHandler);
		$win.resize(scrollHandler);

		scrollHandler();
	});

	return this;
};
