/// <reference types="jquery" />
declare function FixHeader<OPTIONS extends JQueryTableFixedHeader.RegularOptions>(table: HTMLElement, options: OPTIONS, getScrollContainer: (context: JQueryTableFixedHeader.Context<OPTIONS>) => JQuery<any>, getUpdatedStyles: (fixedTop: number, context: JQueryTableFixedHeader.Context<OPTIONS>) => JQuery.PlainObject<string | number>, bindScrollEventHandler: (handler: () => void, context: JQueryTableFixedHeader.Context<OPTIONS>) => void): void;
export default FixHeader;
