import {
  focusVisible
} from "./chunk.Z2SCBKDP.js";
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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/details/details.scss
var details_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --hide-duration: The length of the hide transition.\n * @prop --hide-timing-function: The timing function (easing) to use for the hide transition.\n * @prop --show-duration: The length of the show transition.\n * @prop --show-timing-function: The timing function (easing) to use for the show transition.\n */\n:host {\n  --hide-duration: var(--sl-transition-medium);\n  --hide-timing-function: ease;\n  --show-duration: var(--sl-transition-medium);\n  --show-timing-function: ease;\n  display: block;\n}\n\n.details {\n  border: solid 1px var(--sl-color-gray-200);\n  border-radius: var(--sl-border-radius-medium);\n  overflow-anchor: none;\n}\n\n.details--disabled {\n  opacity: 0.5;\n}\n\n.details__header {\n  display: flex;\n  align-items: center;\n  border-radius: inherit;\n  padding: var(--sl-spacing-medium);\n  user-select: none;\n  cursor: pointer;\n}\n.details__header:focus {\n  outline: none;\n}\n\n.focus-visible .details__header:focus {\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.details--disabled .details__header {\n  cursor: not-allowed;\n}\n.details--disabled .details__header:focus {\n  outline: none;\n  box-shadow: none;\n}\n\n.details__summary {\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n}\n\n.details__summary-icon {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  transition: var(--sl-transition-medium) transform ease;\n}\n\n.details--open .details__summary-icon {\n  transform: rotate(90deg);\n}\n\n.details__body {\n  height: 0;\n  overflow: hidden;\n  transition-property: height;\n  transition-duration: var(--hide-duration);\n  transition-timing-function: var(--hide-timing-function);\n}\n\n.details--open .details__body {\n  transition-duration: var(--show-duration);\n  transition-timing-function: var(--show-timing-function);\n}\n\n.details__content {\n  padding: var(--sl-spacing-medium);\n}";

// src/components/details/details.ts
var id = 0;
var SlDetails = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `details-${++id}`;
    this.isVisible = false;
    this.open = false;
    this.disabled = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.isVisible = this.open;
  }
  firstUpdated() {
    focusVisible.observe(this.details);
    this.body.hidden = !this.open;
    this.body.style.height = this.open ? "auto" : "0";
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    focusVisible.unobserve(this.details);
  }
  show() {
    if (this.isVisible || this.disabled) {
      return;
    }
    const slShow = this.slShow.emit();
    if (slShow.defaultPrevented) {
      this.open = false;
      return;
    }
    this.body.hidden = false;
    if (this.body.scrollHeight === 0) {
      this.body.style.height = "auto";
      this.body.style.overflow = "visible";
    } else {
      this.body.style.height = `${this.body.scrollHeight}px`;
      this.body.style.overflow = "hidden";
    }
    this.isVisible = true;
    this.open = true;
  }
  hide() {
    if (!this.isVisible || this.disabled) {
      return;
    }
    const slHide = this.slHide.emit();
    if (slHide.defaultPrevented) {
      this.open = true;
      return;
    }
    this.body.style.height = `${this.body.scrollHeight}px`;
    this.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      this.body.clientWidth;
      this.body.style.height = "0";
    });
    this.isVisible = false;
    this.open = false;
  }
  handleBodyTransitionEnd(event2) {
    const target = event2.target;
    if (event2.propertyName === "height" && target.classList.contains("details__body")) {
      this.body.style.overflow = this.open ? "visible" : "hidden";
      this.body.style.height = this.open ? "auto" : "0";
      this.open ? this.slAfterShow.emit() : this.slAfterHide.emit();
      this.body.hidden = !this.open;
    }
  }
  handleSummaryClick() {
    if (!this.disabled) {
      this.open ? this.hide() : this.show();
      this.header.focus();
    }
  }
  handleSummaryKeyDown(event2) {
    if (event2.key === "Enter" || event2.key === " ") {
      event2.preventDefault();
      this.open ? this.hide() : this.show();
    }
    if (event2.key === "ArrowUp" || event2.key === "ArrowLeft") {
      event2.preventDefault();
      this.hide();
    }
    if (event2.key === "ArrowDown" || event2.key === "ArrowRight") {
      event2.preventDefault();
      this.show();
    }
  }
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }
  render() {
    return y`
      <div
        part="base"
        class=${e({
      details: true,
      "details--open": this.open,
      "details--disabled": this.disabled
    })}
      >
        <header
          part="header"
          id=${`${this.componentId}-header`}
          class="details__header"
          role="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls=${`${this.componentId}-content`}
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <div part="summary" class="details__summary">
            <slot name="summary">${this.summary}</slot>
          </div>

          <span part="summary-icon" class="details__summary-icon">
            <sl-icon name="chevron-right"></sl-icon>
          </span>
        </header>

        <div class="details__body" @transitionend=${this.handleBodyTransitionEnd}>
          <div
            part="content"
            id=${`${this.componentId}-content`}
            class="details__content"
            role="region"
            aria-labelledby=${`${this.componentId}-header`}
          >
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
};
SlDetails.styles = s(details_default);
__decorate([
  o(".details")
], SlDetails.prototype, "details", 2);
__decorate([
  o(".details__header")
], SlDetails.prototype, "header", 2);
__decorate([
  o(".details__body")
], SlDetails.prototype, "body", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlDetails.prototype, "open", 2);
__decorate([
  e2()
], SlDetails.prototype, "summary", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlDetails.prototype, "disabled", 2);
__decorate([
  event("sl-show")
], SlDetails.prototype, "slShow", 2);
__decorate([
  event("sl-after-show")
], SlDetails.prototype, "slAfterShow", 2);
__decorate([
  event("sl-hide")
], SlDetails.prototype, "slHide", 2);
__decorate([
  event("sl-after-hide")
], SlDetails.prototype, "slAfterHide", 2);
__decorate([
  watch("open")
], SlDetails.prototype, "handleOpenChange", 1);
SlDetails = __decorate([
  n("sl-details")
], SlDetails);
var details_default2 = SlDetails;

export {
  details_default2 as details_default
};
