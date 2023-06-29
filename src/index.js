import $ from 'jquery';
import regularTableFixedHeader from './feature/fix-header-regular';
import containerTableFixedHeader from './feature/fix-header-container';
import autoEnableTableFixedHeader from './utility/auto-enable-table-fixed-header';
$.fn.tableFixedHeader = function (customOptions) {
    if (customOptions && customOptions.scrollContainer) {
        return containerTableFixedHeader.call(this, customOptions);
    }
    else {
        return regularTableFixedHeader.call(this, customOptions);
    }
};
autoEnableTableFixedHeader();
export default $;
