export declare const isIE6: boolean;
export declare const isIE7: boolean;
export declare const isIE8: boolean;
export declare const getActualWidth: ($element: JQuery<HTMLElement>) => number;
export declare function findHeader($table: JQuery, headerRows: number): JQuery<HTMLElement>;
export declare function cloneTableHeadersOnly($table: JQuery, headerRows: number): JQuery<HTMLElement>;
export declare function syncWidth($clonedRowGroups: JQuery, $originalRowGroups: JQuery): void;
export declare const defaultClonedStyle: {
    'margin': string;
    'padding': string;
    'table-layout': string;
    'visibility': string;
    'position': string;
};
