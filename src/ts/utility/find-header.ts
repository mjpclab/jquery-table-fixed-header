function findHeader($table: JQuery, headerRows: number) {
	return $table.find('tr:lt(' + headerRows + ')');
}

export default findHeader;