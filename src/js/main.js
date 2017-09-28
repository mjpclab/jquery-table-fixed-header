"use strict";
var $ = require("jquery");
var utility = require("./module/utility");
var regular_1 = require("./module/regular");
var container_1 = require("./module/container");
$.fn.tableFixedHeader = function (customOptions) {
    if (utility.isIE6) {
        return this;
    }
    else if (customOptions && customOptions.scrollContainer) {
        return container_1["default"].call(this, customOptions);
    }
    else {
        return regular_1["default"].call(this, customOptions);
    }
};
$('table.fixed-header').tableFixedHeader();
module.exports = $;
