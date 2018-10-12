import convertClassNamesToSelector from "./convert-class-names-to-selector";
function getUnprocessedTables($collection, fixedClass) {
    const fixedClassSelector = convertClassNamesToSelector(fixedClass);
    return $collection.filter(`table:not(${fixedClassSelector})`);
}
export default getUnprocessedTables;
