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
  e as e2
} from "./chunk.43UCHSNT.js";
import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/alert/alert.scss
var alert_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --box-shadow: The alert's box shadow.\n */\n:host {\n  display: contents;\n  margin: 0;\n}\n\n.alert {\n  position: relative;\n  display: flex;\n  align-items: stretch;\n  background-color: var(--sl-color-white);\n  border: solid 1px var(--sl-color-gray-200);\n  border-top-width: 3px;\n  border-radius: var(--sl-border-radius-medium);\n  box-shadow: var(--box-shadow);\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-small);\n  font-weight: var(--sl-font-weight-normal);\n  line-height: 1.6;\n  color: var(--sl-color-gray-700);\n  opacity: 0;\n  transform: scale(0.9);\n  transition: var(--sl-transition-medium) opacity ease, var(--sl-transition-medium) transform ease;\n  margin: inherit;\n}\n.alert:not(.alert--visible) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  clip-path: inset(50%);\n  overflow: hidden;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n.alert--open {\n  opacity: 1;\n  transform: none;\n}\n\n.alert__icon {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-large);\n}\n.alert__icon ::slotted(*) {\n  margin-left: var(--sl-spacing-large);\n}\n\n.alert--primary {\n  border-top-color: var(--sl-color-primary-500);\n}\n.alert--primary .alert__icon {\n  color: var(--sl-color-primary-500);\n}\n\n.alert--success {\n  border-top-color: var(--sl-color-success-500);\n}\n.alert--success .alert__icon {\n  color: var(--sl-color-success-500);\n}\n\n.alert--info {\n  border-top-color: var(--sl-color-info-500);\n}\n.alert--info .alert__icon {\n  color: var(--sl-color-info-500);\n}\n\n.alert--warning {\n  border-top-color: var(--sl-color-warning-500);\n}\n.alert--warning .alert__icon {\n  color: var(--sl-color-warning-500);\n}\n\n.alert--danger {\n  border-top-color: var(--sl-color-danger-500);\n}\n.alert--danger .alert__icon {\n  color: var(--sl-color-danger-500);\n}\n\n.alert__message {\n  flex: 1 1 auto;\n  padding: var(--sl-spacing-large);\n  overflow: hidden;\n}\n\n.alert__close {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  font-size: var(--sl-font-size-large);\n  padding-right: var(--sl-spacing-medium);\n}";

// src/components/alert/alert.ts
var toastStack = Object.assign(document.createElement("div"), {className: "sl-toast-stack"});
var SlAlert = class extends h {
  constructor() {
    super(...arguments);
    this.isVisible = false;
    this.open = false;
    this.closable = false;
    this.type = "primary";
    this.duration = Infinity;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.open) {
      this.show();
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
    this.isVisible = true;
    this.open = true;
    if (this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }
  hide() {
    if (!this.open) {
      return;
    }
    const slHide = this.slHide.emit();
    if (slHide.defaultPrevented) {
      this.open = true;
      return;
    }
    clearTimeout(this.autoHideTimeout);
    this.open = false;
  }
  async toast() {
    return new Promise((resolve) => {
      if (!toastStack.parentElement) {
        document.body.append(toastStack);
      }
      toastStack.appendChild(this);
      requestAnimationFrame(() => {
        this.clientWidth;
        this.show();
      });
      this.addEventListener("sl-after-hide", () => {
        toastStack.removeChild(this);
        resolve();
        if (!toastStack.querySelector("sl-alert")) {
          toastStack.remove();
        }
      }, {once: true});
    });
  }
  restartAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }
  handleCloseClick() {
    this.hide();
  }
  handleMouseMove() {
    this.restartAutoHide();
  }
  handleTransitionEnd(event2) {
    const target = event2.target;
    if (event2.propertyName === "opacity" && target.classList.contains("alert")) {
      this.isVisible = this.open;
      this.open ? this.slAfterShow.emit() : this.slAfterHide.emit();
    }
  }
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }
  handleDurationChange() {
    this.restartAutoHide();
  }
  render() {
    return y`
      <div
        part="base"
        class=${e({
      alert: true,
      "alert--open": this.open,
      "alert--visible": this.isVisible,
      "alert--closable": this.closable,
      "alert--primary": this.type === "primary",
      "alert--success": this.type === "success",
      "alert--info": this.type === "info",
      "alert--warning": this.type === "warning",
      "alert--danger": this.type === "danger"
    })}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden=${this.open ? "false" : "true"}
        @mousemove=${this.handleMouseMove.bind(this)}
        @transitionend=${this.handleTransitionEnd.bind(this)}
      >
        <span part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </span>

        <span part="message" class="alert__message">
          <slot></slot>
        </span>

        ${this.closable ? y`
              <span class="alert__close">
                <sl-icon-button
                  exportparts="base:close-button"
                  name="x"
                  @click=${this.handleCloseClick.bind(this)}
                ></sl-icon-button>
              </span>
            ` : ""}
      </div>
    `;
  }
};
SlAlert.styles = s(alert_default);
__decorate([
  r()
], SlAlert.prototype, "isVisible", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlAlert.prototype, "open", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlAlert.prototype, "closable", 2);
__decorate([
  e2({reflect: true})
], SlAlert.prototype, "type", 2);
__decorate([
  e2({type: Number})
], SlAlert.prototype, "duration", 2);
__decorate([
  event("sl-show")
], SlAlert.prototype, "slShow", 2);
__decorate([
  event("sl-after-show")
], SlAlert.prototype, "slAfterShow", 2);
__decorate([
  event("sl-hide")
], SlAlert.prototype, "slHide", 2);
__decorate([
  event("sl-after-hide")
], SlAlert.prototype, "slAfterHide", 2);
__decorate([
  watch("open")
], SlAlert.prototype, "handleOpenChange", 1);
__decorate([
  watch("duration")
], SlAlert.prototype, "handleDurationChange", 1);
SlAlert = __decorate([
  n("sl-alert")
], SlAlert);
var alert_default2 = SlAlert;

export {
  alert_default2 as alert_default
};
