import {
  watch
} from "./chunk.VHTYIQ2U.js";
import {
  o
} from "./chunk.D4XWBMYW.js";
import {
  e
} from "./chunk.43UCHSNT.js";
import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/progress-ring/progress-ring.scss
var progress_ring_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --track-color: The track color.\n * @prop --indicator-color: The indicator color.\n */\n:host {\n  --track-color: var(--sl-color-gray-200);\n  --indicator-color: var(--sl-color-primary-500);\n  display: inline-flex;\n}\n\n.progress-ring {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n\n.progress-ring__image {\n  transform: rotate(-90deg);\n  transform-origin: 50% 50%;\n}\n\n.progress-ring__track {\n  stroke: var(--track-color);\n}\n\n.progress-ring__indicator {\n  stroke: var(--indicator-color);\n  transition: 0.35s stroke-dashoffset, 0.35s stroke;\n}\n\n.progress-ring__label {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  user-select: none;\n}";

// src/components/progress-ring/progress-ring.ts
var SlProgressRing = class extends h {
  constructor() {
    super(...arguments);
    this.size = 128;
    this.strokeWidth = 4;
  }
  firstUpdated() {
    this.updateProgress();
  }
  handlePercentageChange() {
    this.updateProgress();
  }
  updateProgress() {
    const radius = this.indicator.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - this.percentage / 100 * circumference;
    this.indicator.style.strokeDasharray = `${circumference} ${circumference}`;
    this.indicator.style.strokeDashoffset = `${offset}`;
  }
  render() {
    return y`
      <div part="base" class="progress-ring">
        <svg class="progress-ring__image" width=${this.size} height=${this.size}>
          <circle
            class="progress-ring__track"
            stroke-width="${this.strokeWidth}"
            stroke-linecap="round"
            fill="transparent"
            r=${this.size / 2 - this.strokeWidth * 2}
            cx=${this.size / 2}
            cy=${this.size / 2}
          ></circle>

          <circle
            class="progress-ring__indicator"
            stroke-width="${this.strokeWidth}"
            stroke-linecap="round"
            fill="transparent"
            r=${this.size / 2 - this.strokeWidth * 2}
            cx=${this.size / 2}
            cy=${this.size / 2}
          ></circle>
        </svg>

        <span part="label" class="progress-ring__label">
          <slot></slot>
        </span>
      </div>
    `;
  }
};
SlProgressRing.styles = s(progress_ring_default);
__decorate([
  o(".progress-ring__indicator")
], SlProgressRing.prototype, "indicator", 2);
__decorate([
  e({type: Number})
], SlProgressRing.prototype, "size", 2);
__decorate([
  e({attribute: "stroke-width", type: Number})
], SlProgressRing.prototype, "strokeWidth", 2);
__decorate([
  e({type: Number, reflect: true})
], SlProgressRing.prototype, "percentage", 2);
__decorate([
  watch("percentage")
], SlProgressRing.prototype, "handlePercentageChange", 1);
SlProgressRing = __decorate([
  n("sl-progress-ring")
], SlProgressRing);
var progress_ring_default2 = SlProgressRing;

export {
  progress_ring_default2 as progress_ring_default
};
