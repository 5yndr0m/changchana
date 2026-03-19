import {
  __assign
} from "./chunk.6YD35VGL.js";

// node_modules/@lit/reactive-element/decorators/base.js
var o = ({finisher: e, descriptor: t}) => (o2, n) => {
  var r;
  if (n === void 0) {
    const n2 = (r = o2.originalKey) !== null && r !== void 0 ? r : o2.key, i = t != null ? {kind: "method", placement: "prototype", key: n2, descriptor: t(o2.key)} : __assign(__assign({}, o2), {key: n2});
    return e != null && (i.finisher = function(t2) {
      e(t2, n2);
    }), i;
  }
  {
    const r2 = o2.constructor;
    t !== void 0 && Object.defineProperty(o2, n, t(n)), e == null || e(r2, n);
  }
};

export {
  o
};
