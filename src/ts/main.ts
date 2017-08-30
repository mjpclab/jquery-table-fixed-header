import regularTableFixedHeader from './module/regular';
import containerTableFixedHeader from './module/container';

$.fn.tableFixedHeader = function (customOptions?: IJQueryTableFixedHeaderOptions) {
	if (customOptions && customOptions.scrollContainer) {
		return containerTableFixedHeader.call(this, customOptions);
	}
	else {
		return regularTableFixedHeader.call(this, customOptions);
	}
};

export = $;
