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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/badge/badge.scss
var badge_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: inline-flex;\n}\n\n.badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: var(--sl-font-size-x-small);\n  font-weight: var(--sl-font-weight-semibold);\n  letter-spacing: var(--sl-letter-spacing-normal);\n  line-height: 1;\n  border-radius: var(--sl-border-radius-small);\n  white-space: nowrap;\n  padding: 3px 6px;\n  user-select: none;\n  cursor: inherit;\n}\n\n.badge--primary {\n  background-color: var(--sl-color-primary-500);\n  color: var(--sl-color-white);\n}\n\n.badge--success {\n  background-color: var(--sl-color-success-500);\n  color: var(--sl-color-white);\n}\n\n.badge--info {\n  background-color: var(--sl-color-info-500);\n  color: var(--sl-color-white);\n}\n\n.badge--warning {\n  background-color: var(--sl-color-warning-500);\n  color: var(--sl-color-white);\n}\n\n.badge--danger {\n  background-color: var(--sl-color-danger-500);\n  color: var(--sl-color-white);\n}\n\n.badge--pill {\n  border-radius: var(--sl-border-radius-pill);\n}\n\n.badge--pulse {\n  animation: pulse 1.5s infinite;\n}\n\n.badge--pulse.badge--primary {\n  --pulse-color: var(--sl-color-primary-500);\n}\n\n.badge--pulse.badge--success {\n  --pulse-color: var(--sl-color-success-500);\n}\n\n.badge--pulse.badge--info {\n  --pulse-color: var(--sl-color-info-500);\n}\n\n.badge--pulse.badge--warning {\n  --pulse-color: var(--sl-color-warning-500);\n}\n\n.badge--pulse.badge--danger {\n  --pulse-color: var(--sl-color-danger-500);\n}\n\n@keyframes pulse {\n  0% {\n    box-shadow: 0 0 0 0 var(--pulse-color);\n  }\n  70% {\n    box-shadow: 0 0 0 0.5rem transparent;\n  }\n  100% {\n    box-shadow: 0 0 0 0 transparent;\n  }\n}";

// src/components/badge/badge.ts
var SlBadge = class extends h {
  constructor() {
    super(...arguments);
    this.type = "primary";
    this.pill = false;
    this.pulse = false;
  }
  render() {
    return y`
      <span
        part="base"
        class=${e({
      badge: true,
      "badge--primary": this.type === "primary",
      "badge--success": this.type === "success",
      "badge--info": this.type === "info",
      "badge--warning": this.type === "warning",
      "badge--danger": this.type === "danger",
      "badge--pill": this.pill,
      "badge--pulse": this.pulse
    })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
  }
};
SlBadge.styles = s(badge_default);
__decorate([
  e2({reflect: true})
], SlBadge.prototype, "type", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlBadge.prototype, "pill", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlBadge.prototype, "pulse", 2);
SlBadge = __decorate([
  n("sl-badge")
], SlBadge);
var badge_default2 = SlBadge;

export {
  badge_default2 as badge_default
};
