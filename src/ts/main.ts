import $ = require('jquery');

import * as utility from './module/utility';
import regularTableFixedHeader from './module/regular';
import containerTableFixedHeader from './module/container';

$.fn.tableFixedHeader = function (customOptions?: IJQueryTableFixedHeaderOptions) {
	if (utility.isIE6) {
		return this;
	}
	else if (customOptions && customOptions.scrollContainer) {
		return containerTableFixedHeader.call(this, customOptions);
	}
	else {
		return regularTableFixedHeader.call(this, customOptions);
	}
};

export = $;
