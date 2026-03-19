import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlDetails extends LitElement {
    static styles: import("lit").CSSResult;
    details: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    private componentId;
    private isVisible;
    open: boolean;
    summary: string;
    disabled: boolean;
    slShow: EventEmitter<void>;
    slAfterShow: EventEmitter<void>;
    slHide: EventEmitter<void>;
    slAfterHide: EventEmitter<void>;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    show(): void;
    hide(): void;
    handleBodyTransitionEnd(event: TransitionEvent): void;
    handleSummaryClick(): void;
    handleSummaryKeyDown(event: KeyboardEvent): void;
    handleOpenChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-details': SlDetails;
    }
}
