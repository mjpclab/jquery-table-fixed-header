function getFixedTop(value) {
    return typeof value === 'function' ? value() : value;
}
export default getFixedTop;
