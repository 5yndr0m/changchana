import {
  isPreventScrollSupported,
  lockBodyScrolling,
  modal_default,
  unlockBodyScrolling
} from "./chunk.L6P4N6MY.js";
import {
  watch
} from "./chunk.VHTYIQ2U.js";
import {
  hasSlot
} from "./chunk.SZAPYMGB.js";
import {
  l
} from "./chunk.CIYZHJ3O.js";
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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/dialog/dialog.scss
var dialog_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --width: The preferred width of the dialog. Note that the dialog will shrink to accommodate smaller screens.\n */\n:host {\n  --width: 31rem;\n  display: contents;\n}\n\n.dialog {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: var(--sl-z-index-dialog);\n}\n.dialog:not(.dialog--visible) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  clip-path: inset(50%);\n  overflow: hidden;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n.dialog__panel {\n  display: flex;\n  flex-direction: column;\n  z-index: 2;\n  width: var(--width);\n  max-width: calc(100% - var(--sl-spacing-xx-large));\n  max-height: calc(100% - var(--sl-spacing-xx-large));\n  background-color: var(--sl-panel-background-color);\n  border-radius: var(--sl-border-radius-medium);\n  box-shadow: var(--sl-shadow-x-large);\n  opacity: 0;\n  transform: scale(0.8);\n  transition: var(--sl-transition-medium) opacity, var(--sl-transition-medium) transform;\n}\n.dialog__panel:focus {\n  outline: none;\n}\n\n@media screen and (max-width: 420px) {\n  .dialog__panel {\n    max-height: 80vh;\n  }\n}\n.dialog--open .dialog__panel {\n  display: flex;\n  opacity: 1;\n  transform: none;\n}\n\n.dialog__header {\n  flex: 0 0 auto;\n  display: flex;\n}\n\n.dialog__title {\n  flex: 1 1 auto;\n  font-size: var(--sl-font-size-large);\n  line-height: var(--sl-line-height-dense);\n  padding: var(--sl-spacing-large);\n}\n\n.dialog__close {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-x-large);\n  padding: 0 var(--sl-spacing-large);\n}\n\n.dialog__body {\n  flex: 1 1 auto;\n  padding: var(--sl-spacing-large);\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n.dialog__footer {\n  flex: 0 0 auto;\n  text-align: right;\n  padding: var(--sl-spacing-large);\n}\n.dialog__footer ::slotted(sl-button:not(:first-of-type)) {\n  margin-left: var(--sl-spacing-x-small);\n}\n\n.dialog:not(.dialog--has-footer) .dialog__footer {\n  display: none;\n}\n\n.dialog__overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: var(--sl-overlay-background-color);\n  opacity: 0;\n  transition: var(--sl-transition-medium) opacity;\n}\n\n.dialog--open .dialog__overlay {\n  opacity: 1;\n}";

// src/components/dialog/dialog.ts
var hasPreventScroll = isPreventScrollSupported();
var id = 0;
var SlDialog = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `dialog-${++id}`;
    this.willShow = false;
    this.willHide = false;
    this.hasFooter = false;
    this.isVisible = false;
    this.open = false;
    this.label = "";
    this.noHeader = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.modal = new modal_default(this, {
      onfocusOut: () => this.panel.focus()
    });
    this.handleSlotChange();
    if (this.open) {
      this.show();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unlockBodyScrolling(this);
  }
  show() {
    if (this.willShow) {
      return;
    }
    const slShow = this.slShow.emit();
    if (slShow.defaultPrevented) {
      this.open = false;
      return;
    }
    this.willShow = true;
    this.isVisible = true;
    this.open = true;
    this.modal.activate();
    lockBodyScrolling(this);
    if (this.open) {
      if (hasPreventScroll) {
        requestAnimationFrame(() => {
          const slInitialFocus = this.slInitialFocus.emit();
          if (!slInitialFocus.defaultPrevented) {
            this.panel.focus({preventScroll: true});
          }
        });
      } else {
        this.dialog.addEventListener("transitionend", () => {
          const slInitialFocus = this.slInitialFocus.emit();
          if (!slInitialFocus.defaultPrevented) {
            this.panel.focus();
          }
        }, {once: true});
      }
    }
  }
  hide() {
    if (this.willHide) {
      return;
    }
    const slHide = this.slHide.emit();
    if (slHide.defaultPrevented) {
      this.open = true;
      return;
    }
    this.willHide = true;
    this.open = false;
    this.modal.deactivate();
    unlockBodyScrolling(this);
  }
  handleCloseClick() {
    this.hide();
  }
  handleKeyDown(event2) {
    if (event2.key === "Escape") {
      this.hide();
    }
  }
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }
  handleOverlayClick() {
    const slOverlayDismiss = this.slOverlayDismiss.emit();
    if (!slOverlayDismiss.defaultPrevented) {
      this.hide();
    }
  }
  handleSlotChange() {
    this.hasFooter = hasSlot(this, "footer");
  }
  handleTransitionEnd(event2) {
    const target = event2.target;
    if (event2.propertyName === "opacity" && target.classList.contains("dialog__panel")) {
      this.isVisible = this.open;
      this.willShow = false;
      this.willHide = false;
      this.open ? this.slAfterShow.emit() : this.slAfterHide.emit();
    }
  }
  render() {
    return y`
      <div
        part="base"
        class=${e({
      dialog: true,
      "dialog--open": this.open,
      "dialog--visible": this.isVisible,
      "dialog--has-footer": this.hasFooter
    })}
        @keydown=${this.handleKeyDown}
        @transitionend=${this.handleTransitionEnd}
      >
        <div part="overlay" class="dialog__overlay" @click=${this.handleOverlayClick} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? "false" : "true"}
          aria-label=${l(this.noHeader ? this.label : void 0)}
          aria-labelledby=${l(!this.noHeader ? `${this.componentId}-title` : void 0)}
          tabindex="0"
        >
          ${!this.noHeader ? y`
                <header part="header" class="dialog__header">
                  <span part="title" class="dialog__title" id=${`${this.componentId}-title`}>
                    <slot name="label"> ${this.label || String.fromCharCode(65279)} </slot>
                  </span>
                  <sl-icon-button
                    exportparts="base:close-button"
                    class="dialog__close"
                    name="x"
                    @click="${this.handleCloseClick}"
                  ></sl-icon-button>
                </header>
              ` : ""}

          <div part="body" class="dialog__body">
            <slot></slot>
          </div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
SlDialog.styles = s(dialog_default);
__decorate([
  o(".dialog")
], SlDialog.prototype, "dialog", 2);
__decorate([
  o(".dialog__panel")
], SlDialog.prototype, "panel", 2);
__decorate([
  r()
], SlDialog.prototype, "hasFooter", 2);
__decorate([
  r()
], SlDialog.prototype, "isVisible", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlDialog.prototype, "open", 2);
__decorate([
  e2({reflect: true})
], SlDialog.prototype, "label", 2);
__decorate([
  e2({attribute: "no-header", type: Boolean, reflect: true})
], SlDialog.prototype, "noHeader", 2);
__decorate([
  event("sl-show")
], SlDialog.prototype, "slShow", 2);
__decorate([
  event("sl-after-show")
], SlDialog.prototype, "slAfterShow", 2);
__decorate([
  event("sl-hide")
], SlDialog.prototype, "slHide", 2);
__decorate([
  event("sl-after-hide")
], SlDialog.prototype, "slAfterHide", 2);
__decorate([
  event("sl-initial-focus")
], SlDialog.prototype, "slInitialFocus", 2);
__decorate([
  event("sl-overlay-dismiss")
], SlDialog.prototype, "slOverlayDismiss", 2);
__decorate([
  watch("open")
], SlDialog.prototype, "handleOpenChange", 1);
SlDialog = __decorate([
  n("sl-dialog")
], SlDialog);
var dialog_default2 = SlDialog;

export {
  dialog_default2 as dialog_default
};
