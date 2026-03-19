import {
  event
} from "./chunk.BQYDFSNH.js";
import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/resize-observer/resize-observer.scss
var resize_observer_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: contents;\n}";

// src/components/resize-observer/resize-observer.ts
var SlResizeObserver = class extends h {
  constructor() {
    super(...arguments);
    this.observedElements = [];
  }
  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => {
      this.slResize.emit({detail: {entries}});
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.disconnect();
  }
  handleSlotChange() {
    const slot = this.shadowRoot.querySelector("slot");
    const elements = slot.assignedElements({flatten: true});
    this.observedElements.map((el) => this.resizeObserver.unobserve(el));
    this.observedElements = [];
    elements.map((el) => {
      this.resizeObserver.observe(el);
      this.observedElements.push(el);
    });
  }
  render() {
    return y` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
SlResizeObserver.styles = s(resize_observer_default);
__decorate([
  event("sl-resize")
], SlResizeObserver.prototype, "slResize", 2);
SlResizeObserver = __decorate([
  n("sl-resize-observer")
], SlResizeObserver);
var resize_observer_default2 = SlResizeObserver;

export {
  resize_observer_default2 as resize_observer_default
};
