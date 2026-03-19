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

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/responsive-embed/responsive-embed.scss
var responsive_embed_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: block;\n}\n\n.responsive-embed {\n  position: relative;\n}\n.responsive-embed ::slotted(embed),\n.responsive-embed ::slotted(iframe),\n.responsive-embed ::slotted(object) {\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n}";

// src/components/responsive-embed/responsive-embed.ts
var SlResponsiveEmbed = class extends h {
  constructor() {
    super(...arguments);
    this.aspectRatio = "16:9";
  }
  updateAspectRatio() {
    const split = this.aspectRatio.split(":");
    const x = parseInt(split[0]);
    const y2 = parseInt(split[1]);
    this.base.style.paddingBottom = x && y2 ? `${y2 / x * 100}%` : "";
  }
  render() {
    return y`
      <div part="base" class="responsive-embed">
        <slot @slotchange=${() => this.updateAspectRatio()}></slot>
      </div>
    `;
  }
};
SlResponsiveEmbed.styles = s(responsive_embed_default);
__decorate([
  o(".responsive-embed")
], SlResponsiveEmbed.prototype, "base", 2);
__decorate([
  e({attribute: "aspect-ratio"})
], SlResponsiveEmbed.prototype, "aspectRatio", 2);
__decorate([
  watch("aspectRatio")
], SlResponsiveEmbed.prototype, "updateAspectRatio", 1);
SlResponsiveEmbed = __decorate([
  n("sl-responsive-embed")
], SlResponsiveEmbed);
var responsive_embed_default2 = SlResponsiveEmbed;

export {
  responsive_embed_default2 as responsive_embed_default
};
