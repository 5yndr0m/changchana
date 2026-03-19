import {
  o
} from "./chunk.VQHBULNS.js";

// node_modules/@lit/reactive-element/decorators/query.js
function o2(o3, r) {
  return o({descriptor: (t) => {
    const i = {get() {
      var t2;
      return (t2 = this.renderRoot) === null || t2 === void 0 ? void 0 : t2.querySelector(o3);
    }, enumerable: true, configurable: true};
    if (r) {
      const r2 = typeof t == "symbol" ? Symbol() : "__" + t;
      i.get = function() {
        var t2;
        return this[r2] === void 0 && (this[r2] = (t2 = this.renderRoot) === null || t2 === void 0 ? void 0 : t2.querySelector(o3)), this[r2];
      };
    }
    return i;
  }});
}

export {
  o2 as o
};
