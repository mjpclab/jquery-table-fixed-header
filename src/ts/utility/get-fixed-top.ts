function getFixedTop(value: number | (() => number)) {
	return typeof value === 'function' ? value() : value;
}

export default getFixedTop;