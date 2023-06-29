import convertClassNamesToSelector from "./convert-class-names-to-selector";

function getUnprocessedTables($collection: JQuery, fixedClass: string): JQuery<HTMLElement> {
	const fixedClassSelector = convertClassNamesToSelector(fixedClass);
	return $collection.filter(`table:not(${fixedClassSelector})`);
}

export default getUnprocessedTables;