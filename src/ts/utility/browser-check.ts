export const isIE6 = Boolean(
	window.ActiveXObject &&
	!window.XMLHttpRequest
);

export const isIE7 = Boolean(
	window.ActiveXObject &&
	window.XMLHttpRequest &&
	!document.documentMode
);

export const isIE8 = Boolean(
	window.ActiveXObject &&
	window.XMLHttpRequest &&
	document.documentMode &&
	!window.XMLSerializer
);
