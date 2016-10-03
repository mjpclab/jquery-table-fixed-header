var jsdom = require("jsdom");

jsdom.env(
	'<p>hello world</p>',
	function (err, window) {
		var jquery=require('jquery')(window);
		require('../../src/jquery.table-fixed-header')(jquery);
		console.log(jquery.fn.tableFixedHeader);

		require('../../src/jquery.container-table-fixed-header')(jquery);
		console.log(jquery.fn.containerTableFixedHeader);
	}
);