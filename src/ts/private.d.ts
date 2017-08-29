interface Window {
	ActiveXObject: any;
	XMLHttpRequest: any;
}

interface Document {
	documentMode: any;
}

declare function parseInt(value: any): number;