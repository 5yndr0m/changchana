export function isTabbable(el) {
    const tabIndex = el.tabIndex;
    return tabIndex > -1;
}
export function getNearestTabbableElement(el) {
    if (isTabbable(el)) {
        return el;
    }
    if (el.shadowRoot) {
        const tabbableShadowChild = [...el.shadowRoot.children].find(isTabbable);
        if (tabbableShadowChild) {
            return tabbableShadowChild;
        }
    }
    if (el.children) {
        return [...el.children].map(getNearestTabbableElement)[0];
    }
    return null;
}
