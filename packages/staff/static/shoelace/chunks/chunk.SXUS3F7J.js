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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/tab-panel/tab-panel.scss
var tab_panel_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: block;\n}\n\n.tab-panel {\n  border: solid 1px transparent;\n  padding: 20px 20px;\n}";

// src/components/tab-panel/tab-panel.ts
var id = 0;
var SlTabPanel = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `tab-panel-${++id}`;
    this.name = "";
    this.active = false;
  }
  firstUpdated() {
    this.id = this.id || this.componentId;
  }
  render() {
    this.style.display = this.active ? "block" : "none";
    return y`
      <div
        part="base"
        class="tab-panel"
        role="tabpanel"
        aria-selected=${this.active ? "true" : "false"}
        aria-hidden=${this.active ? "false" : "true"}
      >
        <slot></slot>
      </div>
    `;
  }
};
SlTabPanel.styles = s(tab_panel_default);
__decorate([
  e()
], SlTabPanel.prototype, "name", 2);
__decorate([
  e({type: Boolean, reflect: true})
], SlTabPanel.prototype, "active", 2);
SlTabPanel = __decorate([
  n("sl-tab-panel")
], SlTabPanel);
var tab_panel_default2 = SlTabPanel;

export {
  tab_panel_default2 as tab_panel_default
};
