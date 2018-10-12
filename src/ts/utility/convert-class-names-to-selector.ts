const RE_WHITESPACES = /\s+/g;
const SPACE = ' ';
const CLASS_PREFIX = '.';

function convertCssClassToSelector(classNames: string): string {
	return (SPACE + classNames).replace(RE_WHITESPACES, CLASS_PREFIX);
}

export default convertCssClassToSelector;