import {
  i
} from "./chunk.CJOVCTIG.js";
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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/progress-bar/progress-bar.scss
var progress_bar_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --height: The progress bar's height.\n * @prop --track-color: The track color.\n * @prop --indicator-color: The indicator color.\n * @prop --label-color: The label color.\n */\n:host {\n  --height: 16px;\n  --track-color: var(--sl-color-gray-200);\n  --indicator-color: var(--sl-color-primary-500);\n  --label-color: var(--sl-color-white);\n  display: block;\n}\n\n.progress-bar {\n  position: relative;\n  background-color: var(--track-color);\n  height: var(--height);\n  border-radius: var(--sl-border-radius-pill);\n  overflow: hidden;\n}\n\n.progress-bar__indicator {\n  height: 100%;\n  font-family: var(--sl-font-sans);\n  font-size: 12px;\n  font-weight: var(--sl-font-weight-normal);\n  background-color: var(--indicator-color);\n  color: var(--label-color);\n  text-align: center;\n  line-height: var(--height);\n  white-space: nowrap;\n  overflow: hidden;\n  transition: 400ms width, 400ms background-color;\n  user-select: none;\n}\n\n.progress-bar--indeterminate .progress-bar__indicator {\n  position: absolute;\n  animation: indeterminate 2.5s infinite cubic-bezier(0.37, 0, 0.63, 1);\n}\n\n@keyframes indeterminate {\n  0% {\n    left: -50%;\n    width: 50%;\n  }\n  75%, 100% {\n    left: 100%;\n    width: 50%;\n  }\n}";

// src/components/progress-bar/progress-bar.ts
var SlProgressBar = class extends h {
  constructor() {
    super(...arguments);
    this.percentage = 0;
    this.indeterminate = false;
  }
  render() {
    return y`
      <div
        part="base"
        class=${e({
      "progress-bar": true,
      "progress-bar--indeterminate": this.indeterminate
    })}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.indeterminate ? null : this.percentage}"
      >
        <div part="indicator" class="progress-bar__indicator" style=${i({width: this.percentage + "%"})}>
          ${!this.indeterminate ? y`
                <span part="label" class="progress-bar__label">
                  <slot></slot>
                </span>
              ` : ""}
        </div>
      </div>
    `;
  }
};
SlProgressBar.styles = s(progress_bar_default);
__decorate([
  e2({type: Number, reflect: true})
], SlProgressBar.prototype, "percentage", 2);
__decorate([
  e2({type: Boolean, reflect: true})
], SlProgressBar.prototype, "indeterminate", 2);
SlProgressBar = __decorate([
  n("sl-progress-bar")
], SlProgressBar);
var progress_bar_default2 = SlProgressBar;

export {
  progress_bar_default2 as progress_bar_default
};
