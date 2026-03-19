import {
  n
} from "./chunk.IOPMMB65.js";
import {
  getIconLibrary,
  unwatchIcon,
  watchIcon
} from "./chunk.PS2IUS6C.js";
import {
  requestIcon
} from "./chunk.VBE36NLI.js";
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
  i
} from "./chunk.E6AS4E7Y.js";
import {
  e
} from "./chunk.43UCHSNT.js";
import {
  __decorate,
  h,
  n as n2,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// node_modules/lit-html/directives/unsafe-svg.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t = class extends n {
};
t.directiveName = "unsafeSVG", t.resultType = 2;
var o = i(t);

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/icon/icon.scss
var icon_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  contain: strict;\n  box-sizing: content-box !important;\n}\n\n.icon,\nsvg {\n  display: block;\n  height: 100%;\n  width: 100%;\n}";

// src/components/icon/icon.ts
var parser = new DOMParser();
var SlIcon = class extends h {
  constructor() {
    super(...arguments);
    this.svg = "";
    this.library = "default";
  }
  connectedCallback() {
    super.connectedCallback();
    watchIcon(this);
  }
  firstUpdated() {
    this.setIcon();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }
  getLabel() {
    let label = "";
    if (this.label) {
      label = this.label;
    } else if (this.name) {
      label = this.name.replace(/-/g, " ");
    } else if (this.src) {
      label = this.src.replace(/.*\//, "").replace(/-/g, " ").replace(/\.svg/i, "");
    }
    return label;
  }
  redraw() {
    this.setIcon();
  }
  async setIcon() {
    const library = getIconLibrary(this.library);
    let url = this.src;
    if (this.name && library) {
      url = library.resolver(this.name);
    }
    if (url) {
      try {
        const file = await requestIcon(url);
        if (file.ok) {
          const doc = parser.parseFromString(file.svg, "text/html");
          const svgEl = doc.body.querySelector("svg");
          if (svgEl) {
            if (library && library.mutator) {
              library.mutator(svgEl);
            }
            this.svg = svgEl.outerHTML;
            this.slLoad.emit();
          } else {
            this.svg = "";
            this.slError.emit({detail: {status: file.status}});
          }
        } else {
          this.svg = "";
          this.slError.emit({detail: {status: file.status}});
        }
      } catch (e2) {
        this.slError.emit({detail: {status: -1}});
      }
    } else if (this.svg) {
      this.svg = "";
    }
  }
  handleChange() {
    this.setIcon();
  }
  render() {
    return y` <div part="base" class="icon" role="img" aria-label=${this.getLabel()}>${o(this.svg)}</div>`;
  }
};
SlIcon.styles = s(icon_default);
__decorate([
  r()
], SlIcon.prototype, "svg", 2);
__decorate([
  e()
], SlIcon.prototype, "name", 2);
__decorate([
  e()
], SlIcon.prototype, "src", 2);
__decorate([
  e()
], SlIcon.prototype, "label", 2);
__decorate([
  e()
], SlIcon.prototype, "library", 2);
__decorate([
  event("sl-load")
], SlIcon.prototype, "slLoad", 2);
__decorate([
  event("sl-error")
], SlIcon.prototype, "slError", 2);
__decorate([
  watch("name"),
  watch("src"),
  watch("library")
], SlIcon.prototype, "setIcon", 1);
SlIcon = __decorate([
  n2("sl-icon")
], SlIcon);
var icon_default2 = SlIcon;

export {
  icon_default2 as icon_default
};
