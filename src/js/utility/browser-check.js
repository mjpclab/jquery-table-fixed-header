export var isIE6 = Boolean(window.ActiveXObject &&
    !window.XMLHttpRequest);
export var isIE7 = Boolean(window.ActiveXObject &&
    window.XMLHttpRequest &&
    !document.documentMode);
export var isIE8 = Boolean(window.ActiveXObject &&
    window.XMLHttpRequest &&
    document.documentMode &&
    !window.XMLSerializer);
