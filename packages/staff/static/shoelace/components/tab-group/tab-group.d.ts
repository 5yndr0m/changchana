import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
import { SlTab, SlTabPanel } from '../../shoelace';
export default class SlTabGroup extends LitElement {
    static styles: import("lit").CSSResult;
    tabGroup: HTMLElement;
    body: HTMLElement;
    nav: HTMLElement;
    indicator: HTMLElement;
    private activeTab;
    private mutationObserver;
    private resizeObserver;
    private tabs;
    private panels;
    private hasScrollControls;
    placement: 'top' | 'bottom' | 'left' | 'right';
    activation: 'auto' | 'manual';
    noScrollControls: boolean;
    slTabShow: EventEmitter<{
        tab: string;
    }>;
    slTabHide: EventEmitter<{
        tab: string;
    }>;
    firstUpdated(): void;
    disconnectedCallback(): void;
    show(panel: string): void;
    getAllTabs(includeDisabled?: boolean): SlTab[];
    getAllPanels(): [SlTabPanel];
    getActiveTab(): SlTab | undefined;
    handleClick(event: MouseEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleScrollLeft(): void;
    handleScrollRight(): void;
    updateScrollControls(): void;
    setActiveTab(tab: SlTab, emitEvents?: boolean): void;
    setAriaLabels(): void;
    syncIndicator(): void;
    repositionIndicator(): void;
    preventIndicatorTransition(): void;
    syncTabsAndPanels(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-tab-group': SlTabGroup;
    }
}
