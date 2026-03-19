import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/menu-label/menu-label.scss
var menu_label_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: block;\n}\n\n.menu-label {\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-small);\n  font-weight: var(--sl-font-weight-normal);\n  line-height: var(--sl-line-height-normal);\n  letter-spacing: var(--sl-letter-spacing-normal);\n  color: var(--sl-color-gray-400);\n  padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-large);\n  user-select: none;\n}";

// src/components/menu-label/menu-label.ts
var SlMenuLabel = class extends h {
  render() {
    return y`
      <div part="base" class="menu-label">
        <slot></slot>
      </div>
    `;
  }
};
SlMenuLabel.styles = s(menu_label_default);
SlMenuLabel = __decorate([
  n("sl-menu-label")
], SlMenuLabel);
var menu_label_default2 = SlMenuLabel;

export {
  menu_label_default2 as menu_label_default
};
