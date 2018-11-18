var RE_WHITESPACES = /\s+/g;
var SPACE = ' ';
var CLASS_PREFIX = '.';
function convertCssClassToSelector(classNames) {
    return (SPACE + classNames).replace(RE_WHITESPACES, CLASS_PREFIX);
}
export default convertCssClassToSelector;
