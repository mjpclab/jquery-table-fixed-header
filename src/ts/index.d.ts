/// <reference types="jquery" />

declare module 'jquery-table-fixed-header' {
	export = jQuery;
}

interface _JQueryTableFixedHeaderOptions {
	headerRows: number;
	fixedClass: string;
	fixedTop: number | (() => number);
	scrollContainer?: JQuery.Selector | Element | JQuery;
}

type JQueryTableFixedHeaderOptions = Partial<_JQueryTableFixedHeaderOptions>;

interface JQuery {
	tableFixedHeader(options?: JQueryTableFixedHeaderOptions): JQuery;
}
