import {
  focusVisible
} from "./chunk.Z2SCBKDP.js";
import {
  getOffset,
  scrollIntoView
} from "./chunk.YU3SBHCE.js";
import {
  watch
} from "./chunk.VHTYIQ2U.js";
import {
  event
} from "./chunk.BQYDFSNH.js";
import {
  r
} from "./chunk.WYHAP4XO.js";
import {
  e
} from "./chunk.MAMMBD6G.js";
import {
  o
} from "./chunk.D4XWBMYW.js";
import {
  e as e2
} from "./chunk.43UCHSNT.js";
import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/tab-group/tab-group.scss
var tab_group_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --tabs-border-color: The color of the border that separates tabs.\n */\n:host {\n  --tabs-border-color: var(--sl-color-gray-200);\n  display: block;\n}\n\n.tab-group {\n  display: flex;\n  border: solid 1px transparent;\n  border-radius: 0;\n}\n.tab-group .tab-group__tabs {\n  display: flex;\n  position: relative;\n}\n.tab-group .tab-group__indicator {\n  position: absolute;\n  left: 0;\n  transition: var(--sl-transition-fast) transform ease, var(--sl-transition-fast) width ease;\n}\n.tab-group:not(.focus-visible) ::slotted(sl-tab) {\n  --focus-ring: none;\n}\n\n.tab-group--has-scroll-controls .tab-group__nav-container {\n  position: relative;\n  padding: 0 var(--sl-spacing-x-large);\n}\n\n.tab-group__scroll-button {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: var(--sl-spacing-x-large);\n}\n\n.tab-group__scroll-button--left {\n  left: 0;\n}\n\n.tab-group__scroll-button--right {\n  right: 0;\n}\n\n.tab-group--top {\n  flex-direction: column;\n}\n.tab-group--top .tab-group__nav-container {\n  order: 1;\n}\n.tab-group--top .tab-group__nav {\n  display: flex;\n  overflow-x: auto;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.tab-group--top .tab-group__nav::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n}\n.tab-group--top .tab-group__tabs {\n  flex: 1 1 auto;\n  position: relative;\n  flex-direction: row;\n  border-bottom: solid 2px var(--tabs-border-color);\n}\n.tab-group--top .tab-group__indicator {\n  bottom: -2px;\n  border-bottom: solid 2px var(--sl-color-primary-500);\n}\n.tab-group--top .tab-group__body {\n  order: 2;\n}\n\n.tab-group--bottom {\n  flex-direction: column;\n}\n.tab-group--bottom .tab-group__nav-container {\n  order: 2;\n}\n.tab-group--bottom .tab-group__nav {\n  display: flex;\n  overflow-x: auto;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.tab-group--bottom .tab-group__nav::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n}\n.tab-group--bottom .tab-group__tabs {\n  flex: 1 1 auto;\n  position: relative;\n  flex-direction: row;\n  border-top: solid 2px var(--tabs-border-color);\n}\n.tab-group--bottom .tab-group__indicator {\n  top: calc(-1 * 2px);\n  border-top: solid 2px var(--sl-color-primary-500);\n}\n.tab-group--bottom .tab-group__body {\n  order: 1;\n}\n\n.tab-group--left {\n  flex-direction: row;\n}\n.tab-group--left .tab-group__nav-container {\n  order: 1;\n}\n.tab-group--left .tab-group__tabs {\n  flex: 0 0 auto;\n  flex-direction: column;\n  border-right: solid 2px var(--tabs-border-color);\n}\n.tab-group--left .tab-group__indicator {\n  right: calc(-1 * 2px);\n  border-right: solid 2px var(--sl-color-primary-500);\n}\n.tab-group--left .tab-group__body {\n  flex: 1 1 auto;\n  order: 2;\n}\n\n.tab-group--right {\n  flex-direction: row;\n}\n.tab-group--right .tab-group__nav-container {\n  order: 2;\n}\n.tab-group--right .tab-group__tabs {\n  flex: 0 0 auto;\n  flex-direction: column;\n  border-left: solid 2px var(--tabs-border-color);\n}\n.tab-group--right .tab-group__indicator {\n  left: calc(-1 * 2px);\n  border-left: solid 2px var(--sl-color-primary-500);\n}\n.tab-group--right .tab-group__body {\n  flex: 1 1 auto;\n  order: 1;\n}";

// src/components/tab-group/tab-group.ts
var SlTabGroup = class extends h {
  constructor() {
    super(...arguments);
    this.tabs = [];
    this.panels = [];
    this.hasScrollControls = false;
    this.placement = "top";
    this.activation = "auto";
    this.noScrollControls = false;
  }
  firstUpdated() {
    this.syncTabsAndPanels();
    const observer = new IntersectionObserver((entries, observer2) => {
      if (entries[0].intersectionRatio > 0) {
        this.setAriaLabels();
        this.setActiveTab(this.getActiveTab() || this.tabs[0], false);
        observer2.unobserve(entries[0].target);
      }
    });
    observer.observe(this);
    focusVisible.observe(this.tabGroup);
    this.resizeObserver = new ResizeObserver(() => {
      this.preventIndicatorTransition();
      this.repositionIndicator();
      this.updateScrollControls();
    });
    this.resizeObserver.observe(this.nav);
    requestAnimationFrame(() => this.updateScrollControls());
    this.mutationObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => !["aria-labelledby", "aria-controls"].includes(mutation.attributeName))) {
        setTimeout(() => this.setAriaLabels());
      }
      if (mutations.some((mutation) => mutation.attributeName === "disabled")) {
        this.syncTabsAndPanels();
      }
    });
    this.mutationObserver.observe(this, {attributes: true, childList: true, subtree: true});
  }
  disconnectedCallback() {
    this.mutationObserver.disconnect();
    focusVisible.unobserve(this.tabGroup);
    this.resizeObserver.unobserve(this.nav);
  }
  show(panel) {
    const tab = this.tabs.find((el) => el.panel === panel);
    if (tab) {
      this.setActiveTab(tab);
    }
  }
  getAllTabs(includeDisabled = false) {
    const slot = this.shadowRoot.querySelector('slot[name="nav"]');
    return [...slot.assignedElements()].filter((el) => {
      return includeDisabled ? el.tagName.toLowerCase() === "sl-tab" : el.tagName.toLowerCase() === "sl-tab" && !el.disabled;
    });
  }
  getAllPanels() {
    const slot = this.body.querySelector("slot");
    return [...slot.assignedElements()].filter((el) => el.tagName.toLowerCase() === "sl-tab-panel");
  }
  getActiveTab() {
    return this.tabs.find((el) => el.active);
  }
  handleClick(event2) {
    const target = event2.target;
    const tab = target.closest("sl-tab");
    const tabGroup = tab == null ? void 0 : tab.closest("sl-tab-group");
    if (tabGroup !== this) {
      return;
    }
    if (tab) {
      this.setActiveTab(tab);
    }
  }
  handleKeyDown(event2) {
    const target = event2.target;
    const tab = target.closest("sl-tab");
    const tabGroup = tab == null ? void 0 : tab.closest("sl-tab-group");
    if (tabGroup !== this) {
      return;
    }
    if (["Enter", " "].includes(event2.key)) {
      if (tab) {
        this.setActiveTab(tab);
        event2.preventDefault();
      }
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event2.key)) {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName.toLowerCase() === "sl-tab") {
        let index = this.tabs.indexOf(activeEl);
        if (event2.key === "Home") {
          index = 0;
        } else if (event2.key === "End") {
          index = this.tabs.length - 1;
        } else if (event2.key === "ArrowLeft") {
          index = Math.max(0, index - 1);
        } else if (event2.key === "ArrowRight") {
          index = Math.min(this.tabs.length - 1, index + 1);
        }
        this.tabs[index].focus({preventScroll: true});
        if (this.activation === "auto") {
          this.setActiveTab(this.tabs[index]);
        }
        if (["top", "bottom"].includes(this.placement)) {
          scrollIntoView(this.tabs[index], this.nav, "horizontal");
        }
        event2.preventDefault();
      }
    }
  }
  handleScrollLeft() {
    this.nav.scroll({
      left: this.nav.scrollLeft - this.nav.clientWidth,
      behavior: "smooth"
    });
  }
  handleScrollRight() {
    this.nav.scroll({
      left: this.nav.scrollLeft + this.nav.clientWidth,
      behavior: "smooth"
    });
  }
  updateScrollControls() {
    if (this.noScrollControls) {
      this.hasScrollControls = false;
    } else {
      this.hasScrollControls = ["top", "bottom"].includes(this.placement) && this.nav.scrollWidth > this.nav.clientWidth;
    }
  }
  setActiveTab(tab, emitEvents = true) {
    if (tab && tab !== this.activeTab && !tab.disabled) {
      const previousTab = this.activeTab;
      this.activeTab = tab;
      this.tabs.map((el) => el.active = el === this.activeTab);
      this.panels.map((el) => el.active = el.name === this.activeTab.panel);
      this.syncIndicator();
      if (["top", "bottom"].includes(this.placement)) {
        scrollIntoView(this.activeTab, this.nav, "horizontal");
      }
      if (emitEvents) {
        if (previousTab) {
          this.slTabHide.emit({detail: {name: previousTab.panel}});
        }
        this.slTabShow.emit({detail: {name: this.activeTab.panel}});
      }
    }
  }
  setAriaLabels() {
    this.tabs.map((tab) => {
      const panel = this.panels.find((el) => el.name === tab.panel);
      if (panel) {
        tab.setAttribute("aria-controls", panel.getAttribute("id"));
        panel.setAttribute("aria-labelledby", tab.getAttribute("id"));
      }
    });
  }
  syncIndicator() {
    if (this.indicator) {
      const tab = this.getActiveTab();
      if (tab) {
        this.indicator.style.display = "block";
        this.repositionIndicator();
      } else {
        this.indicator.style.display = "none";
        return;
      }
    }
  }
  repositionIndicator() {
    const currentTab = this.getActiveTab();
    if (!currentTab) {
      return;
    }
    const width = currentTab.clientWidth;
    const height = currentTab.clientHeight;
    const offset = getOffset(currentTab, this.nav);
    const offsetTop = offset.top + this.nav.scrollTop;
    const offsetLeft = offset.left + this.nav.scrollLeft;
    switch (this.placement) {
      case "top":
      case "bottom":
        this.indicator.style.width = `${width}px`;
        this.indicator.style.height = "auto";
        this.indicator.style.transform = `translateX(${offsetLeft}px)`;
        break;
      case "left":
      case "right":
        this.indicator.style.width = "auto";
        this.indicator.style.height = `${height}px`;
        this.indicator.style.transform = `translateY(${offsetTop}px)`;
        break;
    }
  }
  preventIndicatorTransition() {
    const transitionValue = this.indicator.style.transition;
    this.indicator.style.transition = "none";
    requestAnimationFrame(() => {
      this.indicator.style.transition = transitionValue;
    });
  }
  syncTabsAndPanels() {
    this.tabs = this.getAllTabs();
    this.panels = this.getAllPanels();
    this.syncIndicator();
  }
  render() {
    return y`
      <div
        part="base"
        class=${e({
      "tab-group": true,
      "tab-group--top": this.placement === "top",
      "tab-group--bottom": this.placement === "bottom",
      "tab-group--left": this.placement === "left",
      "tab-group--right": this.placement === "right",
      "tab-group--has-scroll-controls": this.hasScrollControls
    })}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container">
          ${this.hasScrollControls ? y`
                <sl-icon-button
                  class="tab-group__scroll-button tab-group__scroll-button--left"
                  exportparts="base:scroll-button"
                  name="chevron-left"
                  @click=${this.handleScrollLeft}
                ></sl-icon-button>
              ` : ""}

          <div part="nav" class="tab-group__nav">
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${this.hasScrollControls ? y`
                <sl-icon-button
                  class="tab-group__scroll-button tab-group__scroll-button--right"
                  exportparts="base:scroll-button"
                  name="chevron-right"
                  @click=${this.handleScrollRight}
                ></sl-icon-button>
              ` : ""}
        </div>

        <div part="body" class="tab-group__body">
          <slot @slotchange=${this.syncTabsAndPanels}></slot>
        </div>
      </div>
    `;
  }
};
SlTabGroup.styles = s(tab_group_default);
__decorate([
  o(".tab-group")
], SlTabGroup.prototype, "tabGroup", 2);
__decorate([
  o(".tab-group__body")
], SlTabGroup.prototype, "body", 2);
__decorate([
  o(".tab-group__nav")
], SlTabGroup.prototype, "nav", 2);
__decorate([
  o(".tab-group__indicator")
], SlTabGroup.prototype, "indicator", 2);
__decorate([
  r()
], SlTabGroup.prototype, "hasScrollControls", 2);
__decorate([
  e2()
], SlTabGroup.prototype, "placement", 2);
__decorate([
  e2()
], SlTabGroup.prototype, "activation", 2);
__decorate([
  e2({attribute: "no-scroll-controls", type: Boolean})
], SlTabGroup.prototype, "noScrollControls", 2);
__decorate([
  event("sl-tab-show")
], SlTabGroup.prototype, "slTabShow", 2);
__decorate([
  event("sl-tab-hide")
], SlTabGroup.prototype, "slTabHide", 2);
__decorate([
  watch("noScrollControls")
], SlTabGroup.prototype, "updateScrollControls", 1);
__decorate([
  watch("placement")
], SlTabGroup.prototype, "syncIndicator", 1);
SlTabGroup = __decorate([
  n("sl-tab-group")
], SlTabGroup);
var tab_group_default2 = SlTabGroup;

export {
  tab_group_default2 as tab_group_default
};
