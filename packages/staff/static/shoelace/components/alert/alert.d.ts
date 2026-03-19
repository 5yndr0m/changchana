import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlAlert extends LitElement {
    static styles: import("lit").CSSResult;
    private autoHideTimeout;
    private isVisible;
    open: boolean;
    closable: boolean;
    type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
    duration: number;
    slShow: EventEmitter<void>;
    slAfterShow: EventEmitter<void>;
    slHide: EventEmitter<void>;
    slAfterHide: EventEmitter<void>;
    connectedCallback(): void;
    show(): void;
    hide(): void;
    toast(): Promise<void>;
    restartAutoHide(): void;
    handleCloseClick(): void;
    handleMouseMove(): void;
    handleTransitionEnd(event: TransitionEvent): void;
    handleOpenChange(): void;
    handleDurationChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-alert': SlAlert;
    }
}
