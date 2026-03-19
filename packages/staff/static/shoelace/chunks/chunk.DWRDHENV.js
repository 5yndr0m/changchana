import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/spinner/spinner.scss
var spinner_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n/**\n * @prop --track-color: The color of the spinner's track.\n * @prop --indicator-color: The color of the spinner's indicator.\n * @prop --stroke-width: The width of the indicator.\n */\n:host {\n  --track-color: #0d131e20;\n  --indicator-color: var(--sl-color-primary-500);\n  --stroke-width: 2px;\n  display: inline-flex;\n}\n\n.spinner {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  border-radius: 50%;\n  border: solid var(--stroke-width) var(--track-color);\n  border-top-color: var(--indicator-color);\n  border-right-color: var(--indicator-color);\n  animation: 1s linear infinite spin;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}";

// src/components/spinner/spinner.ts
var SlSpinner = class extends h {
  render() {
    return y` <span part="base" class="spinner" aria-busy="true" aria-live="polite"></span> `;
  }
};
SlSpinner.styles = s(spinner_default);
SlSpinner = __decorate([
  n("sl-spinner")
], SlSpinner);
var spinner_default2 = SlSpinner;

export {
  spinner_default2 as spinner_default
};
