jQuery.fn.tableFixedHeader = function (initOption) {
	"use strict";

	var $ = jQuery;

	var defaultOption = {
		headerRows: 1,
		fixedClass: "table-fixed-header",
		fixedTop: 0
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

	var syncWidth = function ($clonedContainers, $originalContainers) {
		$clonedContainers.each(function (containerIndex, clonedContainer) {
			var $clonedContainer = $(clonedContainer);
			var $originalContainer = $originalContainers.eq(containerIndex);
			$clonedContainer.parent().width(getActualWidth($originalContainer.parent()));
			$clonedContainer.width(getActualWidth($originalContainer));

			$clonedContainer.children().each(function (headerIndex, clonedHeader) {
				var $clonedHeader = $(clonedHeader);
				var $originalHeader = $originalContainer.children().eq(headerIndex);
				$clonedHeader.width(getActualWidth($originalHeader));

				$clonedHeader.children().each(function (cellIndex, clonedCell) {
					var $clonedCell = $(clonedCell);
					var $originalCell = $originalHeader.children().eq(cellIndex);
					$clonedCell.width(getActualWidth($originalCell));
				});
			});
		});
	};

	this.filter("table").each(function (index, element) {
		var $table = $(element);

		var $headers = findHeader($table);
		if (!$headers.length) {
			return;
		}

		var $headerContainers = $headers.parent();

		var $tableCloned = $table.clone();
		var $headersCloned = findHeader($tableCloned);
		var $headerContainersCloned = $headersCloned.parent();

		$tableCloned.find("tr").not($headersCloned).remove();
		$tableCloned.children().not($headerContainersCloned).remove();

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
		var scrollHandler = function (event) {
			if (!$table.data("positioning")) {
				$table.data("positioning", true);
				syncWidth($headerContainersCloned, $headerContainers);

				var fixedTop = getFixedTop();
				var scrollTop = $win.scrollTop();
				var visibleTop = scrollTop + fixedTop;
				var headersTop = $table.offset().top;
				if ((visibleTop >= headersTop ) && (visibleTop + $tableCloned.outerHeight() <= headersTop + $table.outerHeight())) {
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
	});

	return this;
};
