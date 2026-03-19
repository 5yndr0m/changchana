import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
import { SlMenu } from '../../shoelace';
export default class SlDropdown extends LitElement {
    static styles: import("lit").CSSResult;
    trigger: HTMLElement;
    panel: HTMLElement;
    positioner: HTMLElement;
    private componentId;
    private isVisible;
    private popover;
    open: boolean;
    placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    closeOnSelect: boolean;
    containingElement: HTMLElement;
    distance: number;
    skidding: number;
    hoist: boolean;
    slShow: EventEmitter<void>;
    slAfterShow: EventEmitter<void>;
    slHide: EventEmitter<void>;
    slAfterHide: EventEmitter<void>;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    focusOnTrigger(): void;
    getMenu(): SlMenu;
    handleDocumentKeyDown(event: KeyboardEvent): void;
    handleDocumentMouseDown(event: MouseEvent): void;
    handleMenuItemActivate(event: CustomEvent): void;
    handlePanelSelect(event: CustomEvent): void;
    handlePopoverOptionsChange(): void;
    handleTriggerClick(): void;
    handleTriggerKeyDown(event: KeyboardEvent): void;
    handleTriggerKeyUp(event: KeyboardEvent): void;
    handleTriggerSlotChange(): void;
    updateAccessibleTrigger(): void;
    show(): void;
    hide(): void;
    reposition(): void;
    handleOpenChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-dropdown': SlDropdown;
    }
}
