let activeModals = [];
export default class Modal {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.handleFocusIn = this.handleFocusIn.bind(this);
    }
    activate() {
        activeModals.push(this.element);
        document.addEventListener('focusin', this.handleFocusIn);
    }
    deactivate() {
        activeModals = activeModals.filter(modal => modal !== this.element);
        document.removeEventListener('focusin', this.handleFocusIn);
    }
    isActive() {
        return activeModals[activeModals.length - 1] === this.element;
    }
    handleFocusIn(event) {
        var _a, _b;
        const target = event.target;
        const tagName = this.element.tagName.toLowerCase();
        if (this.isActive() && target.closest(tagName) !== this.element && typeof ((_a = this.options) === null || _a === void 0 ? void 0 : _a.onfocusOut) === 'function') {
            (_b = this.options) === null || _b === void 0 ? void 0 : _b.onfocusOut(event);
        }
    }
}
