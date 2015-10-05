jQuery.fn.containerTableFixedHeader = function (initOption) {
	"use strict";

	var $ = jQuery;

	var defaultOption = {
		headerRows: 1,
		fixedClass: "container-table-fixed-header",
		fixedTop: 0,
		scrollContainer: ""
	};

	var option = $.extend({}, defaultOption, initOption);
	if (typeof(option.fixedTop) !== "function") {
		option.fixedTop = parseInt(option.fixedTop);
	}

	var $win = $(window);

	var getFixedTop = function () {
		return typeof(option.fixedTop) === "function" ? option.fixedTop() : option.fixedTop;
	};

	var findHeader = function ($table) {
		return $table.find("tr:lt(" + option.headerRows + ")");
	};

	var getActualWidth = window.getComputedStyle ? function ($element) {
		return window.getComputedStyle($element[0]).width;
	} : function ($element) {
		//for IE8- , the width should including paddings
		return $element.width() + parseInt($element.css("padding-left")) + parseInt($element.css("padding-right"));
	};

	var syncWidth = function ($clonedRowGroups, $originalRowGroups) {
		$clonedRowGroups.each(function (RowGroupIndex, clonedRowGroup) {
			var $clonedRowGroup = $(clonedRowGroup);
			var $originalRowGroup = $originalRowGroups.eq(RowGroupIndex);
			$clonedRowGroup.parent().width(getActualWidth($originalRowGroup.parent()));
			$clonedRowGroup.width(getActualWidth($originalRowGroup));

			$clonedRowGroup.children().each(function (clonedRowIndex, clonedRow) {
				var $clonedRow = $(clonedRow);
				var $originalRow = $originalRowGroup.children().eq(clonedRowIndex);
				$clonedRow.width(getActualWidth($originalRow));

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

		var $scrollContainer = $table.closest(option.scrollContainer).eq(0);
		if (!$scrollContainer.length) {
			return;
		}
		if ($scrollContainer.css("position") === "" || $scrollContainer.css("position") === "static") {
			$scrollContainer.css("position", "relative");
		}

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

		$tableCloned.addClass(option.fixedClass).removeAttr("id").find("[id]").removeAttr("id");
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
				var scrollTop = $scrollContainer.scrollTop();
				var visibleTop = scrollTop + fixedTop;
				var headersTop = $table[0].offsetTop;
				if ((visibleTop >= headersTop) && (visibleTop + $tableCloned.outerHeight() <= headersTop + $table.outerHeight())) {
					var clipRight;
					var tableVisibleWidth = $scrollContainer[0].clientWidth - $table[0].offsetLeft + $scrollContainer.scrollLeft();
					if (tableVisibleWidth < $table.outerWidth()) {
						clipRight = tableVisibleWidth + "px";
					}
					else {
						clipRight = "auto";
					}
					var clipLeft;
					var tableInvisibleLeft = $scrollContainer.scrollLeft() - $table[0].offsetLeft;
					if (tableInvisibleLeft > 0) {
						clipLeft = tableInvisibleLeft + "px";
					}
					else {
						clipLeft = "auto";
					}

					$tableCloned.css({
						"top": $scrollContainer.offset().top - $win.scrollTop() + fixedTop + "px",
						"left": $table.offset().left - $win.scrollLeft() + "px",
						"clip": "rect(auto " + clipRight + " auto " + clipLeft + ")",
						"visibility": "visible"
					});
				} else {
					$tableCloned.css("visibility", "hidden");
				}
				$table.data("positioning", false);
			}
		};
		$scrollContainer.scroll(scrollHandler);
		$win.scroll(scrollHandler);
		$win.resize(scrollHandler);

		scrollHandler();
	});

	return this;
};
