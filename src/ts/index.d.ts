/// <reference types="jquery" />

declare module 'jquery-table-fixed-header' {
	export = jQuery;
}

interface IJQueryTableFixedHeaderOptions {
	headerRows: number;
	fixedClass: string;
	fixedTop: number | (() => number);
	scrollContainer?: JQuery.Selector | Element | JQuery;
}

interface JQuery {
	tableFixedHeader(options?: IJQueryTableFixedHeaderOptions): JQuery;
}
