import findHeader from "./find-header";
function cloneTableHeadersOnly($table, headerRows) {
    const $tableCloned = $table.clone();
    const $headerRowsCloned = findHeader($tableCloned, headerRows);
    const $headerRowGroupsCloned = $headerRowsCloned.parent();
    $tableCloned.find('tr').not($headerRowsCloned).remove();
    $tableCloned.children().not($headerRowGroupsCloned).remove();
    $tableCloned.removeAttr('id').find('[id]').removeAttr('id');
    return $tableCloned;
}
export default cloneTableHeadersOnly;
