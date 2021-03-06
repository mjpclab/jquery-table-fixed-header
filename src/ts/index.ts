/// <reference path='./type/public.d.ts' />

import $ from 'jquery';

import {isIE6} from './utility/browser-check';
import regularTableFixedHeader from './feature/fix-header-regular';
import containerTableFixedHeader from './feature/fix-header-container';
import autoEnableTableFixedHeader from './utility/auto-enable-table-fixed-header';

$.fn.tableFixedHeader = function (customOptions?: JQueryTableFixedHeader.Options) {
	if (isIE6) {
		return this;
	}
	else if (customOptions && customOptions.scrollContainer) {
		return containerTableFixedHeader.call(this, customOptions);
	}
	else {
		return regularTableFixedHeader.call(this, customOptions);
	}
};

autoEnableTableFixedHeader();

export default $;
