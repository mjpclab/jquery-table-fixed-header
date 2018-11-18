import findHeader from "./find-header";
import defaultClonedStyles from "../default/cloned-styles";
function cloneTableHeadersOnly($table, options) {
    var headerRows = options.headerRows, fixedClass = options.fixedClass;
    var $tableCloned = $table.clone();
    var $headerRowsCloned = findHeader($tableCloned, headerRows);
    var $headerRowGroupsCloned = $headerRowsCloned.parent();
    $tableCloned.find('tr').not($headerRowsCloned).remove();
    $tableCloned.children().not($headerRowGroupsCloned).remove();
    $tableCloned.removeAttr('id').find('[id]').removeAttr('id');
    $tableCloned.addClass(fixedClass);
    $tableCloned.css(defaultClonedStyles);
    return $tableCloned;
}
export default cloneTableHeadersOnly;
