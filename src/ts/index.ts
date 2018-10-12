/// <reference path='public.d.ts' />

import $ from 'jquery';

import * as utility from './module/utility';
import regularTableFixedHeader from './module/regular';
import containerTableFixedHeader from './module/container';

$.fn.tableFixedHeader = function (customOptions?: JQueryTableFixedHeader.Options) {
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

$('table.fixed-header').tableFixedHeader();

export default $;