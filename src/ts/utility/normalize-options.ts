function normalizeOptions(options: JQueryTableFixedHeader.RegularOptions) {
	if (typeof options.fixedTop !== 'function') {
		options.fixedTop = parseInt(options.fixedTop);
	}
}

export default normalizeOptions;