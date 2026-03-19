import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlDrawer extends LitElement {
    static styles: import("lit").CSSResult;
    drawer: HTMLElement;
    panel: HTMLElement;
    private componentId;
    private modal;
    private willShow;
    private willHide;
    private hasFooter;
    private isVisible;
    open: boolean;
    label: string;
    placement: 'top' | 'right' | 'bottom' | 'left';
    contained: boolean;
    noHeader: boolean;
    slShow: EventEmitter<void>;
    slAfterShow: EventEmitter<void>;
    slHide: EventEmitter<void>;
    slAfterHide: EventEmitter<void>;
    slInitialFocus: EventEmitter<void>;
    slOverlayDismiss: EventEmitter<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    show(): void;
    hide(): void;
    handleCloseClick(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleOpenChange(): void;
    handleOverlayClick(): void;
    handleSlotChange(): void;
    handleTransitionEnd(event: TransitionEvent): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-drawer': SlDrawer;
    }
}
