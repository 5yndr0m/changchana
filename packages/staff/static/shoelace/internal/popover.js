import { createPopper } from '@popperjs/core/dist/esm';
export default class Popover {
    constructor(anchor, popover, options) {
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.anchor = anchor;
        this.popover = popover;
        this.options = Object.assign({
            skidding: 0,
            distance: 0,
            placement: 'bottom-start',
            strategy: 'absolute',
            transitionElement: this.popover,
            visibleClass: 'popover-visible',
            onAfterShow: () => { },
            onAfterHide: () => { },
            onTransitionEnd: () => { }
        }, options);
        this.isVisible = false;
        this.popover.hidden = true;
        this.popover.classList.remove(this.options.visibleClass);
        this.popover.addEventListener('transitionend', this.handleTransitionEnd);
    }
    handleTransitionEnd(event) {
        const target = event.target;
        if (target === this.options.transitionElement) {
            this.options.onTransitionEnd.call(this, event);
            if (!this.isVisible && !this.popover.hidden) {
                this.popover.hidden = true;
                this.popover.classList.remove(this.options.visibleClass);
                this.options.onAfterHide.call(this);
            }
        }
    }
    destroy() {
        this.popover.removeEventListener('transitionend', this.handleTransitionEnd);
        if (this.popper) {
            this.popper.destroy();
        }
    }
    show() {
        this.isVisible = true;
        this.popover.hidden = false;
        this.popover.clientWidth;
        requestAnimationFrame(() => this.popover.classList.add(this.options.visibleClass));
        if (this.popper) {
            this.popper.destroy();
        }
        this.popper = createPopper(this.anchor, this.popover, {
            placement: this.options.placement,
            strategy: this.options.strategy,
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        boundary: 'viewport'
                    }
                },
                {
                    name: 'offset',
                    options: {
                        offset: [this.options.skidding, this.options.distance]
                    }
                }
            ]
        });
        this.popover.addEventListener('transitionend', () => this.options.onAfterShow.call(this), { once: true });
        requestAnimationFrame(() => this.popper.update());
    }
    hide() {
        this.isVisible = false;
        this.popover.classList.remove(this.options.visibleClass);
    }
    reposition() {
        this.popper.update();
    }
    setOptions(options) {
        this.options = Object.assign(this.options, options);
        this.isVisible
            ? this.popover.classList.add(this.options.visibleClass)
            : this.popover.classList.remove(this.options.visibleClass);
        if (this.popper) {
            this.popper.setOptions({
                placement: this.options.placement,
                strategy: this.options.strategy
            });
            requestAnimationFrame(() => this.popper.update());
        }
    }
}
