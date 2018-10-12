/// <reference types="jquery" />

declare namespace JQueryTableFixedHeader {
	interface RegularOptions {
		headerRows: number;
		fixedClass: string;
		fixedTop: number | (() => number);
	}

	interface ContainerOptions extends RegularOptions {
		scrollContainer: JQuery.Selector | Element | JQuery;
	}

	interface AllOptions extends ContainerOptions {
	}

	type Options = Partial<AllOptions>;
}

interface JQuery {
	tableFixedHeader(options?: JQueryTableFixedHeader.Options): JQuery;
}
