import {
  popover_default
} from "./chunk.XHBICS3Y.js";
import {
  scrollIntoView
} from "./chunk.YU3SBHCE.js";
import {
  watch
} from "./chunk.VHTYIQ2U.js";
import {
  event
} from "./chunk.BQYDFSNH.js";
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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/dropdown/dropdown.scss
var dropdown_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: inline-block;\n}\n\n.dropdown {\n  position: relative;\n}\n\n.dropdown__trigger {\n  display: block;\n}\n\n.dropdown__positioner {\n  position: absolute;\n  z-index: var(--sl-z-index-dropdown);\n}\n\n.dropdown__panel {\n  max-height: 75vh;\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-medium);\n  font-weight: var(--sl-font-weight-normal);\n  color: var(--color);\n  background-color: var(--sl-panel-background-color);\n  border: solid 1px var(--sl-panel-border-color);\n  border-radius: var(--sl-border-radius-medium);\n  box-shadow: var(--sl-shadow-large);\n  opacity: 0;\n  overflow: auto;\n  overscroll-behavior: none;\n  pointer-events: none;\n  transform: scale(0.9);\n  transition: var(--sl-transition-fast) opacity, var(--sl-transition-fast) transform;\n}\n\n.dropdown__positioner[data-popper-placement^=top] .dropdown__panel {\n  transform-origin: bottom;\n}\n.dropdown__positioner[data-popper-placement^=bottom] .dropdown__panel {\n  transform-origin: top;\n}\n.dropdown__positioner[data-popper-placement^=left] .dropdown__panel {\n  transform-origin: right;\n}\n.dropdown__positioner[data-popper-placement^=right] .dropdown__panel {\n  transform-origin: left;\n}\n.dropdown__positioner.popover-visible .dropdown__panel {\n  opacity: 1;\n  transform: none;\n  pointer-events: all;\n}";

// src/internal/tabbable.ts
function isTabbable(el) {
  const tabIndex = el.tabIndex;
  return tabIndex > -1;
}
function getNearestTabbableElement(el) {
  if (isTabbable(el)) {
    return el;
  }
  if (el.shadowRoot) {
    const tabbableShadowChild = [...el.shadowRoot.children].find(isTabbable);
    if (tabbableShadowChild) {
      return tabbableShadowChild;
    }
  }
  if (el.children) {
    return [...el.children].map(getNearestTabbableElement)[0];
  }
  return null;
}

// src/components/dropdown/dropdown.ts
var id = 0;
var SlDropdown = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `dropdown-${++id}`;
    this.isVisible = false;
    this.open = false;
    this.placement = "bottom-start";
    this.closeOnSelect = true;
    this.distance = 2;
    this.skidding = 0;
    this.hoist = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleMenuItemActivate = this.handleMenuItemActivate.bind(this);
    this.handlePanelSelect = this.handlePanelSelect.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleDocumentMouseDown = this.handleDocumentMouseDown.bind(this);
    if (!this.containingElement) {
      this.containingElement = this;
    }
  }
  firstUpdated() {
    this.popover = new popover_default(this.trigger, this.positioner, {
      strategy: this.hoist ? "fixed" : "absolute",
      placement: this.placement,
      distance: this.distance,
      skidding: this.skidding,
      transitionElement: this.panel,
      onAfterHide: () => this.slAfterHide.emit(),
      onAfterShow: () => this.slAfterShow.emit(),
      onTransitionEnd: () => {
        if (!this.open) {
          this.panel.scrollTop = 0;
        }
      }
    });
    if (this.open) {
      this.show();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.hide();
    this.popover.destroy();
  }
  focusOnTrigger() {
    const slot = this.trigger.querySelector("slot");
    const trigger = slot.assignedElements({flatten: true})[0];
    if (trigger && typeof trigger.focus === "function") {
      trigger.focus();
    }
  }
  getMenu() {
    const slot = this.panel.querySelector("slot");
    return slot.assignedElements({flatten: true}).filter((el) => el.tagName.toLowerCase() === "sl-menu")[0];
  }
  handleDocumentKeyDown(event2) {
    var _a;
    if (event2.key === "Escape") {
      this.hide();
      this.focusOnTrigger();
      return;
    }
    if (event2.key === "Tab") {
      if (this.open && ((_a = document.activeElement) == null ? void 0 : _a.tagName.toLowerCase()) === "sl-menu-item") {
        event2.preventDefault();
        this.hide();
        this.focusOnTrigger();
        return;
      }
      setTimeout(() => {
        var _a2, _b;
        const activeElement = this.containingElement.getRootNode() instanceof ShadowRoot ? (_b = (_a2 = document.activeElement) == null ? void 0 : _a2.shadowRoot) == null ? void 0 : _b.activeElement : document.activeElement;
        if ((activeElement == null ? void 0 : activeElement.closest(this.containingElement.tagName.toLowerCase())) !== this.containingElement) {
          this.hide();
          return;
        }
      });
    }
  }
  handleDocumentMouseDown(event2) {
    const path = event2.composedPath();
    if (!path.includes(this.containingElement)) {
      this.hide();
      return;
    }
  }
  handleMenuItemActivate(event2) {
    const item = event2.target;
    scrollIntoView(item, this.panel);
  }
  handlePanelSelect(event2) {
    const target = event2.target;
    if (this.closeOnSelect && target.tagName.toLowerCase() === "sl-menu") {
      this.hide();
      this.focusOnTrigger();
    }
  }
  handlePopoverOptionsChange() {
    if (this.popover) {
      this.popover.setOptions({
        strategy: this.hoist ? "fixed" : "absolute",
        placement: this.placement,
        distance: this.distance,
        skidding: this.skidding
      });
    }
  }
  handleTriggerClick() {
    this.open ? this.hide() : this.show();
  }
  handleTriggerKeyDown(event2) {
    const menu = this.getMenu();
    const menuItems = menu ? [...menu.querySelectorAll("sl-menu-item")] : [];
    const firstMenuItem = menuItems[0];
    const lastMenuItem = menuItems[menuItems.length - 1];
    if (event2.key === "Escape") {
      this.focusOnTrigger();
      this.hide();
      return;
    }
    if ([" ", "Enter"].includes(event2.key)) {
      event2.preventDefault();
      this.open ? this.hide() : this.show();
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(event2.key)) {
      event2.preventDefault();
      if (!this.open) {
        this.show();
      }
      if (event2.key === "ArrowDown" && firstMenuItem) {
        firstMenuItem.focus();
        return;
      }
      if (event2.key === "ArrowUp" && lastMenuItem) {
        lastMenuItem.focus();
        return;
      }
    }
    const ignoredKeys = ["Tab", "Shift", "Meta", "Ctrl", "Alt"];
    if (this.open && menu && !ignoredKeys.includes(event2.key)) {
      menu.typeToSelect(event2.key);
      return;
    }
  }
  handleTriggerKeyUp(event2) {
    if (event2.key === " ") {
      event2.preventDefault();
    }
  }
  handleTriggerSlotChange() {
    this.updateAccessibleTrigger();
  }
  updateAccessibleTrigger() {
    if (this.trigger) {
      const slot = this.trigger.querySelector("slot");
      const assignedElements = slot.assignedElements({flatten: true});
      const accessibleTrigger = assignedElements.map(getNearestTabbableElement)[0];
      if (accessibleTrigger) {
        accessibleTrigger.setAttribute("aria-haspopup", "true");
        accessibleTrigger.setAttribute("aria-expanded", this.open ? "true" : "false");
      }
    }
  }
  show() {
    if (this.isVisible) {
      return;
    }
    const slShow = this.slShow.emit();
    if (slShow.defaultPrevented) {
      this.open = false;
      return;
    }
    this.panel.addEventListener("sl-activate", this.handleMenuItemActivate);
    this.panel.addEventListener("sl-select", this.handlePanelSelect);
    document.addEventListener("keydown", this.handleDocumentKeyDown);
    document.addEventListener("mousedown", this.handleDocumentMouseDown);
    this.isVisible = true;
    this.open = true;
    this.popover.show();
  }
  hide() {
    if (!this.isVisible) {
      return;
    }
    const slHide = this.slHide.emit();
    if (slHide.defaultPrevented) {
      this.open = true;
      return;
    }
    this.panel.removeEventListener("sl-activate", this.handleMenuItemActivate);
    this.panel.removeEventListener("sl-select", this.handlePanelSelect);
    document.addEventListener("keydown", this.handleDocumentKeyDown);
    document.removeEventListener("mousedown", this.handleDocumentMouseDown);
    this.isVisible = false;
    this.open = false;
    this.popover.hide();
  }
  reposition() {
    if (!this.open) {
      return;
    }
    this.popover.reposition();
  }
  handleOpenChange() {
    this.open ? this.show() : this.hide();
    this.updateAccessibleTrigger();
  }
  render() {
    return y`
      <div
        part="base"
        id=${this.componentId}
        class=${e({
      dropdown: true,
      "dropdown--open": this.open
    })}
      >
        <span
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
        >
          <slot name="trigger" @slotchange=${this.handleTriggerSlotChange}></slot>
        </span>

        <!-- Position the panel with a wrapper since the popover makes use of translate. This let's us add transitions
        on the panel without interfering with the position. -->
        <div class="dropdown__positioner">
          <div
            part="panel"
            class="dropdown__panel"
            role="menu"
            aria-hidden=${this.open ? "false" : "true"}
            aria-labelledby=${this.componentId}
          >
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
};
SlDropdown.styles = s(dropdown_default);
__decorate([
  o(".dropdown__trigger")
], SlDropdown.prototype, "trigger", 2);
__decorate([
  o(".dropdown__panel")
], SlDropdown.prototype, "panel", 2);
__decorate([
  o(".dropdown__positioner")
], SlDropdown.prototype, "positioner", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlDropdown.prototype, "open", 2);
__decorate([
  e2()
], SlDropdown.prototype, "placement", 2);
__decorate([
  e2({attribute: "close-on-select", type: Boolean, reflect: true})
], SlDropdown.prototype, "closeOnSelect", 2);
__decorate([
  e2({attribute: false})
], SlDropdown.prototype, "containingElement", 2);
__decorate([
  e2({type: Number})
], SlDropdown.prototype, "distance", 2);
__decorate([
  e2({type: Number})
], SlDropdown.prototype, "skidding", 2);
__decorate([
  e2({type: Boolean})
], SlDropdown.prototype, "hoist", 2);
__decorate([
  event("sl-show")
], SlDropdown.prototype, "slShow", 2);
__decorate([
  event("sl-after-show")
], SlDropdown.prototype, "slAfterShow", 2);
__decorate([
  event("sl-hide")
], SlDropdown.prototype, "slHide", 2);
__decorate([
  event("sl-after-hide")
], SlDropdown.prototype, "slAfterHide", 2);
__decorate([
  watch("distance"),
  watch("hoist"),
  watch("placement"),
  watch("skidding")
], SlDropdown.prototype, "handlePopoverOptionsChange", 1);
__decorate([
  watch("open")
], SlDropdown.prototype, "handleOpenChange", 1);
SlDropdown = __decorate([
  n("sl-dropdown")
], SlDropdown);
var dropdown_default2 = SlDropdown;

export {
  dropdown_default2 as dropdown_default
};
