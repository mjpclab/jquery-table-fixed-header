function findHeader($table, headerRows) {
    return $table.find('tr:lt(' + headerRows + ')');
}
export default findHeader;
