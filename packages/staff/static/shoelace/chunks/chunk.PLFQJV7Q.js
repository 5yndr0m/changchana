import {
  popover_default
} from "./chunk.XHBICS3Y.js";
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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/tooltip/tooltip.scss
var tooltip_default = ':host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --hide-delay: The amount of time to wait before hiding the tooltip.\n * @prop --hide-duration: The amount of time the hide transition takes to complete.\n * @prop --hide-timing-function: The timing function (easing) to use for the hide transition.\n * @prop --max-width: The maximum width of the tooltip.\n * @prop --show-delay: The amount of time to wait before showing the tooltip.\n * @prop --show-duration: The amount of time the show transition takes to complete.\n * @prop --show-timing-function: The timing function (easing) to use for the show transition.\n */\n:host {\n  --max-width: 20rem;\n  --hide-delay: 0s;\n  --hide-duration: 0.125s;\n  --hide-timing-function: ease;\n  --show-delay: 0.125s;\n  --show-duration: 0.125s;\n  --show-timing-function: ease;\n  display: contents;\n}\n\n.tooltip-positioner {\n  position: absolute;\n  z-index: var(--sl-z-index-tooltip);\n  pointer-events: none;\n}\n\n.tooltip {\n  max-width: var(--max-width);\n  border-radius: var(--sl-tooltip-border-radius);\n  background-color: var(--sl-tooltip-background-color);\n  font-family: var(--sl-tooltip-font-family);\n  font-size: var(--sl-tooltip-font-size);\n  font-weight: var(--sl-tooltip-font-weight);\n  line-height: var(--sl-tooltip-line-height);\n  color: var(--sl-tooltip-color);\n  opacity: 0;\n  padding: var(--sl-tooltip-padding);\n  transform: scale(0.8);\n  transform-origin: bottom;\n  transition-property: opacity, transform;\n  transition-delay: var(--hide-delay);\n  transition-duration: var(--hide-duration);\n  transition-timing-function: var(--hide-timing-function);\n}\n.tooltip:after {\n  content: "";\n  position: absolute;\n  width: 0;\n  height: 0;\n}\n\n.tooltip-positioner[data-popper-placement^=top] .tooltip {\n  transform-origin: bottom;\n}\n.tooltip-positioner[data-popper-placement^=bottom] .tooltip {\n  transform-origin: top;\n}\n.tooltip-positioner[data-popper-placement^=left] .tooltip {\n  transform-origin: right;\n}\n.tooltip-positioner[data-popper-placement^=right] .tooltip {\n  transform-origin: left;\n}\n.tooltip-positioner.popover-visible .tooltip {\n  opacity: 1;\n  transform: none;\n  transition-delay: var(--show-delay);\n  transition-duration: var(--show-duration);\n  transition-timing-function: var(--show-timing-function);\n}\n\n.tooltip-positioner[data-popper-placement^=bottom] .tooltip:after {\n  bottom: 100%;\n  left: calc(50% - var(--sl-tooltip-arrow-size));\n  border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-left: var(--sl-tooltip-arrow-size) solid transparent;\n  border-right: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=bottom-start] .tooltip:after {\n  left: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=bottom-end] .tooltip:after {\n  right: var(--sl-tooltip-arrow-start-end-offset);\n  left: auto;\n}\n\n.tooltip-positioner[data-popper-placement^=top] .tooltip:after {\n  top: 100%;\n  left: calc(50% - var(--sl-tooltip-arrow-size));\n  border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-left: var(--sl-tooltip-arrow-size) solid transparent;\n  border-right: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=top-start] .tooltip:after {\n  left: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=top-end] .tooltip:after {\n  right: var(--sl-tooltip-arrow-start-end-offset);\n  left: auto;\n}\n\n.tooltip-positioner[data-popper-placement^=left] .tooltip:after {\n  top: calc(50% - var(--sl-tooltip-arrow-size));\n  left: 100%;\n  border-left: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-top: var(--sl-tooltip-arrow-size) solid transparent;\n  border-bottom: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=left-start] .tooltip:after {\n  top: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=left-end] .tooltip:after {\n  top: auto;\n  bottom: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement^=right] .tooltip:after {\n  top: calc(50% - var(--sl-tooltip-arrow-size));\n  right: 100%;\n  border-right: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);\n  border-top: var(--sl-tooltip-arrow-size) solid transparent;\n  border-bottom: var(--sl-tooltip-arrow-size) solid transparent;\n}\n\n.tooltip-positioner[data-popper-placement=right-start] .tooltip:after {\n  top: var(--sl-tooltip-arrow-start-end-offset);\n}\n\n.tooltip-positioner[data-popper-placement=right-end] .tooltip:after {\n  top: auto;\n  bottom: var(--sl-tooltip-arrow-start-end-offset);\n}';

// src/components/tooltip/tooltip.ts
var id = 0;
var SlTooltip = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `tooltip-${++id}`;
    this.isVisible = false;
    this.content = "";
    this.placement = "top";
    this.disabled = false;
    this.distance = 10;
    this.open = false;
    this.skidding = 0;
    this.trigger = "hover focus";
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }
  firstUpdated() {
    this.target = this.getTarget();
    this.popover = new popover_default(this.target, this.positioner);
    this.syncOptions();
    this.addEventListener("blur", this.handleBlur, true);
    this.addEventListener("focus", this.handleFocus, true);
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
    this.addEventListener("mouseover", this.handleMouseOver);
    this.addEventListener("mouseout", this.handleMouseOut);
    this.positioner.hidden = !this.open;
    if (this.open) {
      this.show();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.popover.destroy();
    this.removeEventListener("blur", this.handleBlur, true);
    this.removeEventListener("focus", this.handleFocus, true);
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
    this.removeEventListener("mouseover", this.handleMouseOver);
    this.removeEventListener("mouseout", this.handleMouseOut);
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
    this.isVisible = false;
    this.open = false;
    this.popover.hide();
  }
  getTarget() {
    const target = [...this.children].find((el) => el.tagName.toLowerCase() !== "style" && el.getAttribute("slot") !== "content");
    if (!target) {
      throw new Error("Invalid tooltip target: no child element was found.");
    }
    return target;
  }
  handleBlur() {
    if (this.hasTrigger("focus")) {
      this.hide();
    }
  }
  handleClick() {
    if (this.hasTrigger("click")) {
      this.open ? this.hide() : this.show();
    }
  }
  handleFocus() {
    if (this.hasTrigger("focus")) {
      this.show();
    }
  }
  handleKeyDown(event2) {
    if (this.open && event2.key === "Escape") {
      event2.stopPropagation();
      this.hide();
    }
  }
  handleMouseOver() {
    if (this.hasTrigger("hover")) {
      this.show();
    }
  }
  handleMouseOut() {
    if (this.hasTrigger("hover")) {
      this.hide();
    }
  }
  handleOpenChange() {
    this.open ? this.show() : this.hide();
  }
  handleOptionsChange() {
    this.syncOptions();
  }
  handleDisabledChange() {
    if (this.disabled && this.open) {
      this.hide();
    }
  }
  handleSlotChange() {
    const oldTarget = this.target;
    const newTarget = this.getTarget();
    if (newTarget !== oldTarget) {
      if (oldTarget) {
        oldTarget.removeAttribute("aria-describedby");
      }
      newTarget.setAttribute("aria-describedby", this.componentId);
    }
  }
  hasTrigger(triggerType) {
    const triggers = this.trigger.split(" ");
    return triggers.includes(triggerType);
  }
  syncOptions() {
    if (this.popover) {
      this.popover.setOptions({
        placement: this.placement,
        distance: this.distance,
        skidding: this.skidding,
        transitionElement: this.tooltip,
        onAfterHide: () => this.slAfterHide.emit(),
        onAfterShow: () => this.slAfterShow.emit()
      });
    }
  }
  render() {
    return y`
      <slot @slotchange=${this.handleSlotChange.bind(this)}></slot>

      <div class="tooltip-positioner">
        <div
          part="base"
          id=${this.componentId}
          class=${e({
      tooltip: true,
      "tooltip--open": this.open
    })}
          role="tooltip"
          aria-hidden=${this.open ? "false" : "true"}
        >
          <slot name="content">${this.content}</slot>
        </div>
      </div>
    `;
  }
};
SlTooltip.styles = s(tooltip_default);
__decorate([
  o(".tooltip-positioner")
], SlTooltip.prototype, "positioner", 2);
__decorate([
  o(".tooltip")
], SlTooltip.prototype, "tooltip", 2);
__decorate([
  e2()
], SlTooltip.prototype, "content", 2);
__decorate([
  e2()
], SlTooltip.prototype, "placement", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlTooltip.prototype, "disabled", 2);
__decorate([
  e2({type: Number})
], SlTooltip.prototype, "distance", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlTooltip.prototype, "open", 2);
__decorate([
  e2({type: Number})
], SlTooltip.prototype, "skidding", 2);
__decorate([
  e2()
], SlTooltip.prototype, "trigger", 2);
__decorate([
  event("sl-show")
], SlTooltip.prototype, "slShow", 2);
__decorate([
  event("sl-after-show")
], SlTooltip.prototype, "slAfterShow", 2);
__decorate([
  event("sl-hide")
], SlTooltip.prototype, "slHide", 2);
__decorate([
  event("sl-after-hide")
], SlTooltip.prototype, "slAfterHide", 2);
__decorate([
  watch("open")
], SlTooltip.prototype, "handleOpenChange", 1);
__decorate([
  watch("placement"),
  watch("distance"),
  watch("skidding")
], SlTooltip.prototype, "handleOptionsChange", 1);
__decorate([
  watch("disabled")
], SlTooltip.prototype, "handleDisabledChange", 1);
SlTooltip = __decorate([
  n("sl-tooltip")
], SlTooltip);
var tooltip_default2 = SlTooltip;

export {
  tooltip_default2 as tooltip_default
};
