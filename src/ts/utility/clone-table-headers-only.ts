import findHeader from "./find-header";
import defaultClonedStyles from "../default/cloned-styles";

function cloneTableHeadersOnly($table: JQuery, options: JQueryTableFixedHeader.RegularOptions) {
	const {headerRows, fixedClass} = options;

	const $tableCloned = $table.clone();
	const $headerRowsCloned = findHeader($tableCloned, headerRows);
	const $headerRowGroupsCloned = $headerRowsCloned.parent();

	$tableCloned.find('tr').not($headerRowsCloned).remove();
	$tableCloned.children().not($headerRowGroupsCloned).remove();

	$tableCloned.removeAttr('id').find('[id]').removeAttr('id');
	$tableCloned.addClass(fixedClass);
	$tableCloned.css(defaultClonedStyles);

	return $tableCloned;
}

export default cloneTableHeadersOnly;