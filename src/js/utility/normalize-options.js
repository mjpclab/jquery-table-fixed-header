function normalizeOptions(options) {
    if (typeof options.fixedTop !== 'function') {
        options.fixedTop = parseInt(options.fixedTop);
    }
}
export default normalizeOptions;
