import {
  locks
} from "./chunk.7JLEAHXS.js";

// src/internal/modal.ts
var activeModals = [];
var Modal = class {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.handleFocusIn = this.handleFocusIn.bind(this);
  }
  activate() {
    activeModals.push(this.element);
    document.addEventListener("focusin", this.handleFocusIn);
  }
  deactivate() {
    activeModals = activeModals.filter((modal) => modal !== this.element);
    document.removeEventListener("focusin", this.handleFocusIn);
  }
  isActive() {
    return activeModals[activeModals.length - 1] === this.element;
  }
  handleFocusIn(event) {
    var _a, _b;
    const target = event.target;
    const tagName = this.element.tagName.toLowerCase();
    if (this.isActive() && target.closest(tagName) !== this.element && typeof ((_a = this.options) == null ? void 0 : _a.onfocusOut) === "function") {
      (_b = this.options) == null ? void 0 : _b.onfocusOut(event);
    }
  }
};
var modal_default = Modal;

// src/internal/scroll.ts
function lockBodyScrolling(lockingEl) {
  locks.add(lockingEl);
  document.body.classList.add("sl-scroll-lock");
}
function unlockBodyScrolling(lockingEl) {
  locks.delete(lockingEl);
  if (locks.size === 0) {
    document.body.classList.remove("sl-scroll-lock");
  }
}

// src/internal/support.ts
function isPreventScrollSupported() {
  let supported = false;
  document.createElement("div").focus({
    get preventScroll() {
      supported = true;
      return false;
    }
  });
  return supported;
}

export {
  isPreventScrollSupported,
  lockBodyScrolling,
  unlockBodyScrolling,
  modal_default
};
