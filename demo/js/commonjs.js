var JSDOM = require('jsdom').JSDOM;

var dom = new JSDOM('<p>hello world</p>');
var window = dom.window;
var jquery=require('jquery')(window);

require('../../src/jquery.table-fixed-header')(jquery);
console.log(jquery.fn.tableFixedHeader);

require('../../src/jquery.container-table-fixed-header')(jquery);
console.log(jquery.fn.containerTableFixedHeader);
