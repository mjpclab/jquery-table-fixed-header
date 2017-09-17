interface Window {
	ActiveXObject: any;
	XMLHttpRequest: any;
	XMLSerializer: any;
}

interface Document {
	documentMode: any;
}

declare function parseInt(value: any): number;