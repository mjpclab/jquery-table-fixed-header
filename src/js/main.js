"use strict";
var regular_1 = require("./module/regular");
var container_1 = require("./module/container");
$.fn.tableFixedHeader = function (customOptions) {
    if (customOptions && customOptions.scrollContainer) {
        return container_1["default"].call(this, customOptions);
    }
    else {
        return regular_1["default"].call(this, customOptions);
    }
};
module.exports = $;
