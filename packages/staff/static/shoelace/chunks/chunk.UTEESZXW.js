import {
  getTextContent
} from "./chunk.HMBXZWMM.js";
import {
  event
} from "./chunk.BQYDFSNH.js";
import {
  o
} from "./chunk.D4XWBMYW.js";
import {
  __decorate,
  h,
  n,
  s,
  y
} from "./chunk.MXDRQAVA.js";

// _xm1jjf1sz:/Users/jirattikarn/Work/shoelace/src/components/menu/menu.scss
var menu_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n:host {\n  display: block;\n}\n\n.menu {\n  padding: var(--sl-spacing-x-small) 0;\n}\n.menu:focus {\n  outline: none;\n}";

// src/components/menu/menu.ts
var SlMenu = class extends h {
  constructor() {
    super(...arguments);
    this.typeToSelectString = "";
  }
  typeToSelect(key) {
    clearTimeout(this.typeToSelectTimeout);
    this.typeToSelectTimeout = setTimeout(() => this.typeToSelectString = "", 750);
    this.typeToSelectString += key.toLowerCase();
    const items = this.getItems();
    for (const item of items) {
      const slot = item.shadowRoot.querySelector("slot:not([name])");
      const label = getTextContent(slot).toLowerCase().trim();
      if (label.substring(0, this.typeToSelectString.length) === this.typeToSelectString) {
        item.focus();
        break;
      }
    }
  }
  getItems() {
    const slot = this.menu.querySelector("slot");
    return [...slot.assignedElements({flatten: true})].filter((el) => el.tagName.toLowerCase() === "sl-menu-item" && !el.disabled);
  }
  getActiveItem() {
    return this.getItems().filter((i) => i.shadowRoot.querySelector(".menu-item--focused"))[0];
  }
  setActiveItem(item) {
    item.focus();
  }
  handleClick(event2) {
    const target = event2.target;
    const item = target.closest("sl-menu-item");
    if (item && !item.disabled) {
      this.slSelect.emit({detail: {item}});
    }
  }
  handleKeyDown(event2) {
    if (event2.key === "Enter") {
      const item = this.getActiveItem();
      event2.preventDefault();
      if (item) {
        this.slSelect.emit({detail: {item}});
      }
    }
    if (event2.key === " ") {
      event2.preventDefault();
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event2.key)) {
      const items = this.getItems();
      const selectedItem = this.getActiveItem();
      let index = selectedItem ? items.indexOf(selectedItem) : 0;
      if (items.length) {
        event2.preventDefault();
        if (event2.key === "ArrowDown") {
          index++;
        } else if (event2.key === "ArrowUp") {
          index--;
        } else if (event2.key === "Home") {
          index = 0;
        } else if (event2.key === "End") {
          index = items.length - 1;
        }
        if (index < 0)
          index = 0;
        if (index > items.length - 1)
          index = items.length - 1;
        this.setActiveItem(items[index]);
        return;
      }
    }
    this.typeToSelect(event2.key);
  }
  render() {
    return y`
      <div part="base" class="menu" role="menu" @click=${this.handleClick} @keydown=${this.handleKeyDown} tabindex="0">
        <slot></slot>
      </div>
    `;
  }
};
SlMenu.styles = s(menu_default);
__decorate([
  o(".menu")
], SlMenu.prototype, "menu", 2);
__decorate([
  event("sl-select")
], SlMenu.prototype, "slSelect", 2);
SlMenu = __decorate([
  n("sl-menu")
], SlMenu);
var menu_default2 = SlMenu;

export {
  menu_default2 as menu_default
};
