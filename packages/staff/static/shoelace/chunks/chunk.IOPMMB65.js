import {
  i,
  s,
  t
} from "./chunk.E6AS4E7Y.js";
import {
  T,
  x
} from "./chunk.MXDRQAVA.js";

// node_modules/lit-html/directives/unsafe-html.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var n = class extends s {
  constructor(i2) {
    if (super(i2), this.vt = T, i2.type !== t.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r) {
    if (r === T)
      return this.Vt = void 0, this.vt = r;
    if (r === x)
      return r;
    if (typeof r != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r === this.vt)
      return this.Vt;
    this.vt = r;
    const s2 = [r];
    return s2.raw = s2, this.Vt = {_$litType$: this.constructor.resultType, strings: s2, values: []};
  }
};
n.directiveName = "unsafeHTML", n.resultType = 1;
var o = i(n);

export {
  n,
  o
};
