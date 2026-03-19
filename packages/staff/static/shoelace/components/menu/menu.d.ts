import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
import { SlMenuItem } from '../../shoelace';
export default class SlMenu extends LitElement {
    static styles: import("lit").CSSResult;
    menu: HTMLElement;
    private typeToSelectString;
    private typeToSelectTimeout;
    slSelect: EventEmitter<{
        item: SlMenuItem;
    }>;
    typeToSelect(key: string): void;
    getItems(): [SlMenuItem];
    getActiveItem(): SlMenuItem;
    setActiveItem(item: SlMenuItem): void;
    handleClick(event: MouseEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-menu': SlMenu;
    }
}
