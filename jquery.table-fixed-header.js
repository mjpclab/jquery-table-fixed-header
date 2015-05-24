jQuery.fn.tableFixedHeader = function (initOption) {
	"use strict";

	var $ = jQuery;

	var defaultOption = {
		headerRows: 1,
		fixedClass: "table-fixed-header",
		fixedTop: "0"
	};

	var option = $.extend({}, defaultOption, initOption);
	option.fixedTop = parseInt(option.fixedTop);

	var $win = $(window);
	//var isIE6 = (window.ActiveXObject && !window.XMLHttpRequest);
	var isIE7 = (window.ActiveXObject && window.XMLHttpRequest && !document.documentMode);
	var raf = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function (callback) {
			setTimeout(callback, 1000 / 60);
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

	var syncSize = function ($clonedContainers, $originalContainers) {
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
		var updating = false;
		var delaySyncSize = function () {
			if (!updating) {
				updating = true;
				raf(function () {
					syncSize($headerContainersCloned, $headerContainers);
					updating = false;
				});
			}
		};

		var $table = $(element);
		var $headers = findHeader($table);
		if ($headers.length) {
			var $headerContainers = $headers.parent();

			var $tableCloned = $table.clone();
			var $headersCloned = findHeader($tableCloned);
			var $headerContainersCloned = $headersCloned.parent();

			$tableCloned.find("tr").not($headersCloned).remove();
			$tableCloned.children().not($headerContainersCloned).remove();

			$tableCloned.removeAttr("id").find("[id]").removeAttr("id");
			$tableCloned.css("table-layout", "fixed").addClass(option.fixedClass);
			if (!isIE7) {      //hide() not work for IE7, use $win.scroll() below
				$tableCloned.hide();
			}
			delaySyncSize();

			$table.after($tableCloned);

			var toggling = false;

			var switchHeaderVisible = function () {
				if (!toggling) {
					toggling = true;
					raf(function () {
						var scrollTop = $win.scrollTop();
						var headersTop = $headers.offset().top;
						if ((scrollTop > headersTop - option.fixedTop) && (scrollTop <= headersTop + $table.outerHeight(true) - $tableCloned.outerHeight(true) - option.fixedTop)) {
							syncSize($headerContainersCloned, $headerContainers);
							$tableCloned.show();
							$win.on("resize", delaySyncSize);
						} else {
							$tableCloned.hide();
							$win.off("resize", delaySyncSize);
						}
						toggling = false;
					});
				}
			};

			var positioning = false;
			$win.scroll(function () {
				if (!positioning) {
					positioning = true;
					raf(function () {
						$tableCloned.css({
							"position": "fixed",
							"top": option.fixedTop + "px",
							"left": $table.offset().left - $win.scrollLeft(),
							"zoom": 1    //for IE7
						});
						switchHeaderVisible();
						positioning = false;
					});
				}
			});
			$win.scroll();
		}
	});

	return this;
};
