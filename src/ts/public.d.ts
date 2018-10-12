/// <reference types="jquery" />

declare namespace JQueryTableFixedHeader {
	interface NecessaryOptions {
		headerRows: number;
		fixedClass: string;
		fixedTop: number | (() => number);
		scrollContainer?: JQuery.Selector | Element | JQuery;
	}

	type Options = Partial<NecessaryOptions>;
}

interface JQuery {
	tableFixedHeader(options?: JQueryTableFixedHeader.Options): JQuery;
}
