interface Window {
	ActiveXObject: any;
	XMLHttpRequest: any;
	XMLSerializer: any;
}

interface Document {
	documentMode: any;
}

declare function parseInt(value: any): number;

declare namespace JQueryTableFixedHeader {
	interface Context<OPTIONS extends RegularOptions> {
		$table: JQuery<HTMLElement>;
		options: OPTIONS;
		$scrollContainer: JQuery<any>;
	}
}