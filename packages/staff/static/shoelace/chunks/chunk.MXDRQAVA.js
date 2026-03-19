import {
  __defProp
} from "./chunk.7OS2CJRR.js";
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/decorators/base.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/custom-element.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var n = (n7) => (e5) => typeof e5 == "function" ? ((n8, e6) => (window.customElements.define(n8, e6), e6))(n7, e5) : ((n8, e6) => {
  const {kind: t4, elements: i4} = e6;
  return {kind: t4, elements: i4, finisher(e7) {
    window.customElements.define(n8, e7);
  }};
})(n7, e5);

// node_modules/@lit/reactive-element/decorators/property.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/query-async.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/query.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/state.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/event-options.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/query-all.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t = Element.prototype;
var n2 = t.msMatchesSelector || t.webkitMatchesSelector;

// node_modules/lit-html/lit-html.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t2;
var i;
var s;
var e2;
var o2 = `lit$${(Math.random() + "").slice(9)}$`;
var l = "?" + o2;
var n3 = `<${l}>`;
var h = document;
var r = (t4 = "") => h.createComment(t4);
var u = (t4) => t4 === null || typeof t4 != "object" && typeof t4 != "function";
var c = Array.isArray;
var d = (t4) => {
  var i4;
  return c(t4) || typeof ((i4 = t4) === null || i4 === void 0 ? void 0 : i4[Symbol.iterator]) == "function";
};
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var a = /-->/g;
var f = />/g;
var _ = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
var m = /'/g;
var p = /"/g;
var $ = /^(?:script|style|textarea)$/i;
var g = (t4) => (i4, ...s5) => ({_$litType$: t4, strings: i4, values: s5});
var y = g(1);
var b = g(2);
var x = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var w = new WeakMap();
var A = (t4, i4, s5) => {
  var e5, o6;
  const l4 = (e5 = s5 == null ? void 0 : s5.renderBefore) !== null && e5 !== void 0 ? e5 : i4;
  let n7 = l4._$litPart$;
  if (n7 === void 0) {
    const t5 = (o6 = s5 == null ? void 0 : s5.renderBefore) !== null && o6 !== void 0 ? o6 : null;
    l4._$litPart$ = n7 = new M(i4.insertBefore(r(), t5), t5, void 0, s5);
  }
  return n7.I(t4), n7;
};
var P = h.createTreeWalker(h, 133, null, false);
var V = (t4, i4) => {
  const s5 = t4.length - 1, e5 = [];
  let l4, h4 = i4 === 2 ? "<svg>" : "", r4 = v;
  for (let i5 = 0; i5 < s5; i5++) {
    const s6 = t4[i5];
    let u2, c2, d2 = -1, g2 = 0;
    for (; g2 < s6.length && (r4.lastIndex = g2, c2 = r4.exec(s6), c2 !== null); )
      g2 = r4.lastIndex, r4 === v ? c2[1] === "!--" ? r4 = a : c2[1] !== void 0 ? r4 = f : c2[2] !== void 0 ? ($.test(c2[2]) && (l4 = RegExp("</" + c2[2], "g")), r4 = _) : c2[3] !== void 0 && (r4 = _) : r4 === _ ? c2[0] === ">" ? (r4 = l4 != null ? l4 : v, d2 = -1) : c2[1] === void 0 ? d2 = -2 : (d2 = r4.lastIndex - c2[2].length, u2 = c2[1], r4 = c2[3] === void 0 ? _ : c2[3] === '"' ? p : m) : r4 === p || r4 === m ? r4 = _ : r4 === a || r4 === f ? r4 = v : (r4 = _, l4 = void 0);
    const y2 = r4 === _ && t4[i5 + 1].startsWith("/>") ? " " : "";
    h4 += r4 === v ? s6 + n3 : d2 >= 0 ? (e5.push(u2), s6.slice(0, d2) + "$lit$" + s6.slice(d2) + o2 + y2) : s6 + o2 + (d2 === -2 ? (e5.push(void 0), i5) : y2);
  }
  return [h4 + (t4[s5] || "<?>") + (i4 === 2 ? "</svg>" : ""), e5];
};
var E = class {
  constructor({strings: t4, _$litType$: i4}, s5) {
    let e5;
    this.parts = [];
    let n7 = 0, h4 = 0, u2 = 0;
    const c2 = t4.length - 1, [d2, v2] = V(t4, i4);
    if (this.el = E.createElement(d2, s5), P.currentNode = this.el.content, i4 === 2) {
      const t5 = this.el.content, i5 = t5.firstChild;
      i5.remove(), t5.append(...i5.childNodes);
    }
    for (; (e5 = P.nextNode()) !== null && h4 < c2; ) {
      if (e5.nodeType === 1) {
        if (e5.hasAttributes()) {
          const t5 = [];
          for (const i5 of e5.getAttributeNames())
            if (i5.endsWith("$lit$") || i5.startsWith(o2)) {
              const s6 = v2[u2++];
              if (t5.push(i5), s6 !== void 0) {
                const t6 = e5.getAttribute(s6.toLowerCase() + "$lit$").split(o2), i6 = /([.?@])?(.*)/.exec(s6);
                this.parts.push({type: 1, index: n7, name: i6[2], strings: t6, ctor: i6[1] === "." ? C : i6[1] === "?" ? I : i6[1] === "@" ? R : k}), h4 += t6.length - 1;
              } else
                this.parts.push({type: 6, index: n7});
            }
          for (const i5 of t5)
            e5.removeAttribute(i5);
        }
        if ($.test(e5.tagName)) {
          const t5 = e5.textContent.split(o2), i5 = t5.length - 1;
          if (i5 > 0) {
            e5.textContent = "";
            for (let s6 = 0; s6 < i5; s6++)
              e5.append(t5[s6] || r()), this.parts.push({type: 2, index: ++n7}), h4++;
            e5.append(t5[i5] || r());
          }
        }
      } else if (e5.nodeType === 8)
        if (e5.data === l)
          h4++, this.parts.push({type: 2, index: n7});
        else {
          let t5 = -1;
          for (; (t5 = e5.data.indexOf(o2, t5 + 1)) !== -1; )
            this.parts.push({type: 7, index: n7}), h4++, t5 += o2.length - 1;
        }
      n7++;
    }
  }
  static createElement(t4, i4) {
    const s5 = h.createElement("template");
    return s5.innerHTML = t4, s5;
  }
};
function N(t4, i4, s5 = t4, e5) {
  var o6, l4, n7, h4;
  if (i4 === x)
    return i4;
  let r4 = e5 !== void 0 ? (o6 = s5.\u03A3i) === null || o6 === void 0 ? void 0 : o6[e5] : s5.\u03A3o;
  const c2 = u(i4) ? void 0 : i4._$litDirective$;
  return (r4 == null ? void 0 : r4.constructor) !== c2 && ((l4 = r4 == null ? void 0 : r4.O) === null || l4 === void 0 || l4.call(r4, false), c2 === void 0 ? r4 = void 0 : (r4 = new c2(t4), r4.T(t4, s5, e5)), e5 !== void 0 ? ((n7 = (h4 = s5).\u03A3i) !== null && n7 !== void 0 ? n7 : h4.\u03A3i = [])[e5] = r4 : s5.\u03A3o = r4), r4 !== void 0 && (i4 = N(t4, r4.S(t4, i4.values), r4, e5)), i4;
}
var S = class {
  constructor(t4, i4) {
    this.l = [], this.N = void 0, this.D = t4, this.M = i4;
  }
  u(t4) {
    var i4;
    const {el: {content: s5}, parts: e5} = this.D, o6 = ((i4 = t4 == null ? void 0 : t4.creationScope) !== null && i4 !== void 0 ? i4 : h).importNode(s5, true);
    P.currentNode = o6;
    let l4 = P.nextNode(), n7 = 0, r4 = 0, u2 = e5[0];
    for (; u2 !== void 0 && l4 !== null; ) {
      if (n7 === u2.index) {
        let i5;
        u2.type === 2 ? i5 = new M(l4, l4.nextSibling, this, t4) : u2.type === 1 ? i5 = new u2.ctor(l4, u2.name, u2.strings, this, t4) : u2.type === 6 && (i5 = new z(l4, this, t4)), this.l.push(i5), u2 = e5[++r4];
      }
      u2 !== void 0 && n7 !== u2.index && (l4 = P.nextNode(), n7++);
    }
    return o6;
  }
  v(t4) {
    let i4 = 0;
    for (const s5 of this.l)
      s5 !== void 0 && (s5.strings !== void 0 ? (s5.I(t4, s5, i4), i4 += s5.strings.length - 2) : s5.I(t4[i4])), i4++;
  }
};
var M = class {
  constructor(t4, i4, s5, e5) {
    this.type = 2, this.N = void 0, this.A = t4, this.B = i4, this.M = s5, this.options = e5;
  }
  setConnected(t4) {
    var i4;
    (i4 = this.P) === null || i4 === void 0 || i4.call(this, t4);
  }
  get parentNode() {
    return this.A.parentNode;
  }
  get startNode() {
    return this.A;
  }
  get endNode() {
    return this.B;
  }
  I(t4, i4 = this) {
    t4 = N(this, t4, i4), u(t4) ? t4 === T || t4 == null || t4 === "" ? (this.H !== T && this.R(), this.H = T) : t4 !== this.H && t4 !== x && this.m(t4) : t4._$litType$ !== void 0 ? this._(t4) : t4.nodeType !== void 0 ? this.$(t4) : d(t4) ? this.g(t4) : this.m(t4);
  }
  k(t4, i4 = this.B) {
    return this.A.parentNode.insertBefore(t4, i4);
  }
  $(t4) {
    this.H !== t4 && (this.R(), this.H = this.k(t4));
  }
  m(t4) {
    const i4 = this.A.nextSibling;
    i4 !== null && i4.nodeType === 3 && (this.B === null ? i4.nextSibling === null : i4 === this.B.previousSibling) ? i4.data = t4 : this.$(h.createTextNode(t4)), this.H = t4;
  }
  _(t4) {
    var i4;
    const {values: s5, _$litType$: e5} = t4, o6 = typeof e5 == "number" ? this.C(t4) : (e5.el === void 0 && (e5.el = E.createElement(e5.h, this.options)), e5);
    if (((i4 = this.H) === null || i4 === void 0 ? void 0 : i4.D) === o6)
      this.H.v(s5);
    else {
      const t5 = new S(o6, this), i5 = t5.u(this.options);
      t5.v(s5), this.$(i5), this.H = t5;
    }
  }
  C(t4) {
    let i4 = w.get(t4.strings);
    return i4 === void 0 && w.set(t4.strings, i4 = new E(t4)), i4;
  }
  g(t4) {
    c(this.H) || (this.H = [], this.R());
    const i4 = this.H;
    let s5, e5 = 0;
    for (const o6 of t4)
      e5 === i4.length ? i4.push(s5 = new M(this.k(r()), this.k(r()), this, this.options)) : s5 = i4[e5], s5.I(o6), e5++;
    e5 < i4.length && (this.R(s5 && s5.B.nextSibling, e5), i4.length = e5);
  }
  R(t4 = this.A.nextSibling, i4) {
    var s5;
    for ((s5 = this.P) === null || s5 === void 0 || s5.call(this, false, true, i4); t4 && t4 !== this.B; ) {
      const i5 = t4.nextSibling;
      t4.remove(), t4 = i5;
    }
  }
};
var k = class {
  constructor(t4, i4, s5, e5, o6) {
    this.type = 1, this.H = T, this.N = void 0, this.V = void 0, this.element = t4, this.name = i4, this.M = e5, this.options = o6, s5.length > 2 || s5[0] !== "" || s5[1] !== "" ? (this.H = Array(s5.length - 1).fill(T), this.strings = s5) : this.H = T;
  }
  get tagName() {
    return this.element.tagName;
  }
  I(t4, i4 = this, s5, e5) {
    const o6 = this.strings;
    let l4 = false;
    if (o6 === void 0)
      t4 = N(this, t4, i4, 0), l4 = !u(t4) || t4 !== this.H && t4 !== x, l4 && (this.H = t4);
    else {
      const e6 = t4;
      let n7, h4;
      for (t4 = o6[0], n7 = 0; n7 < o6.length - 1; n7++)
        h4 = N(this, e6[s5 + n7], i4, n7), h4 === x && (h4 = this.H[n7]), l4 || (l4 = !u(h4) || h4 !== this.H[n7]), h4 === T ? t4 = T : t4 !== T && (t4 += (h4 != null ? h4 : "") + o6[n7 + 1]), this.H[n7] = h4;
    }
    l4 && !e5 && this.W(t4);
  }
  W(t4) {
    t4 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 != null ? t4 : "");
  }
};
var C = class extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  W(t4) {
    this.element[this.name] = t4 === T ? void 0 : t4;
  }
};
var I = class extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  W(t4) {
    t4 && t4 !== T ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
};
var R = class extends k {
  constructor() {
    super(...arguments), this.type = 5;
  }
  I(t4, i4 = this) {
    var s5;
    if ((t4 = (s5 = N(this, t4, i4, 0)) !== null && s5 !== void 0 ? s5 : T) === x)
      return;
    const e5 = this.H, o6 = t4 === T && e5 !== T || t4.capture !== e5.capture || t4.once !== e5.once || t4.passive !== e5.passive, l4 = t4 !== T && (e5 === T || o6);
    o6 && this.element.removeEventListener(this.name, this, e5), l4 && this.element.addEventListener(this.name, this, t4), this.H = t4;
  }
  handleEvent(t4) {
    var i4, s5;
    typeof this.H == "function" ? this.H.call((s5 = (i4 = this.options) === null || i4 === void 0 ? void 0 : i4.host) !== null && s5 !== void 0 ? s5 : this.element, t4) : this.H.handleEvent(t4);
  }
};
var z = class {
  constructor(t4, i4, s5) {
    this.element = t4, this.type = 6, this.N = void 0, this.V = void 0, this.M = i4, this.options = s5;
  }
  I(t4) {
    N(this, t4);
  }
};
(i = (t2 = globalThis).litHtmlPlatformSupport) === null || i === void 0 || i.call(t2, E, M), ((s = (e2 = globalThis).litHtmlVersions) !== null && s !== void 0 ? s : e2.litHtmlVersions = []).push("2.0.0-pre.7");

// node_modules/@lit/reactive-element/css-tag.js
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t3 = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var e3 = Symbol();
var n4 = class {
  constructor(t4, n7) {
    if (n7 !== e3)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4;
  }
  get styleSheet() {
    return t3 && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
  }
  toString() {
    return this.cssText;
  }
};
var s2 = (t4) => new n4(t4 + "", e3);
var o3 = new Map();
var i2 = (e5, n7) => {
  t3 ? e5.adoptedStyleSheets = n7.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet) : n7.forEach((t4) => {
    const n8 = document.createElement("style");
    n8.textContent = t4.cssText, e5.appendChild(n8);
  });
};
var S2 = t3 ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e5 = "";
  for (const n7 of t5.cssRules)
    e5 += n7.cssText;
  return s2(e5);
})(t4) : t4;

// node_modules/@lit/reactive-element/reactive-element.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var s3;
var e4;
var h2;
var r3;
var o4 = {toAttribute(t4, i4) {
  switch (i4) {
    case Boolean:
      t4 = t4 ? "" : null;
      break;
    case Object:
    case Array:
      t4 = t4 == null ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, i4) {
  let s5 = t4;
  switch (i4) {
    case Boolean:
      s5 = t4 !== null;
      break;
    case Number:
      s5 = t4 === null ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        s5 = JSON.parse(t4);
      } catch (t5) {
        s5 = null;
      }
  }
  return s5;
}};
var n5 = (t4, i4) => i4 !== t4 && (i4 == i4 || t4 == t4);
var l2 = {attribute: true, type: String, converter: o4, reflect: false, hasChanged: n5};
var a2 = class extends HTMLElement {
  constructor() {
    super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
  }
  static addInitializer(t4) {
    var i4;
    (i4 = this.v) !== null && i4 !== void 0 || (this.v = []), this.v.push(t4);
  }
  static get observedAttributes() {
    this.finalize();
    const t4 = [];
    return this.elementProperties.forEach((i4, s5) => {
      const e5 = this.\u03A0p(s5, i4);
      e5 !== void 0 && (this.\u03A0m.set(e5, s5), t4.push(e5));
    }), t4;
  }
  static createProperty(t4, i4 = l2) {
    if (i4.state && (i4.attribute = false), this.finalize(), this.elementProperties.set(t4, i4), !i4.noAccessor && !this.prototype.hasOwnProperty(t4)) {
      const s5 = typeof t4 == "symbol" ? Symbol() : "__" + t4, e5 = this.getPropertyDescriptor(t4, s5, i4);
      e5 !== void 0 && Object.defineProperty(this.prototype, t4, e5);
    }
  }
  static getPropertyDescriptor(t4, i4, s5) {
    return {get() {
      return this[i4];
    }, set(e5) {
      const h4 = this[t4];
      this[i4] = e5, this.requestUpdate(t4, h4, s5);
    }, configurable: true, enumerable: true};
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) || l2;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t4 = Object.getPrototypeOf(this);
    if (t4.finalize(), this.elementProperties = new Map(t4.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
      const t5 = this.properties, i4 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
      for (const s5 of i4)
        this.createProperty(s5, t5[s5]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i4) {
    const s5 = [];
    if (Array.isArray(i4)) {
      const e5 = new Set(i4.flat(1 / 0).reverse());
      for (const i5 of e5)
        s5.unshift(S2(i5));
    } else
      i4 !== void 0 && s5.push(S2(i4));
    return s5;
  }
  static \u03A0p(t4, i4) {
    const s5 = i4.attribute;
    return s5 === false ? void 0 : typeof s5 == "string" ? s5 : typeof t4 == "string" ? t4.toLowerCase() : void 0;
  }
  u() {
    var t4;
    this.\u03A0g = new Promise((t5) => this.enableUpdating = t5), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t4 = this.constructor.v) === null || t4 === void 0 || t4.forEach((t5) => t5(this));
  }
  addController(t4) {
    var i4, s5;
    ((i4 = this.\u03A0U) !== null && i4 !== void 0 ? i4 : this.\u03A0U = []).push(t4), this.isConnected && ((s5 = t4.hostConnected) === null || s5 === void 0 || s5.call(t4));
  }
  removeController(t4) {
    var i4;
    (i4 = this.\u03A0U) === null || i4 === void 0 || i4.splice(this.\u03A0U.indexOf(t4) >>> 0, 1);
  }
  \u03A0_() {
    this.constructor.elementProperties.forEach((t4, i4) => {
      this.hasOwnProperty(i4) && (this.\u03A0i.set(i4, this[i4]), delete this[i4]);
    });
  }
  createRenderRoot() {
    var t4;
    const s5 = (t4 = this.shadowRoot) !== null && t4 !== void 0 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
    return i2(s5, this.constructor.elementStyles), s5;
  }
  connectedCallback() {
    var t4;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
      var i4;
      return (i4 = t5.hostConnected) === null || i4 === void 0 ? void 0 : i4.call(t5);
    }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    var t4;
    (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
      var i4;
      return (i4 = t5.hostDisconnected) === null || i4 === void 0 ? void 0 : i4.call(t5);
    }), this.\u03A0o = new Promise((t5) => this.\u03A0l = t5);
  }
  attributeChangedCallback(t4, i4, s5) {
    this.K(t4, s5);
  }
  \u03A0j(t4, i4, s5 = l2) {
    var e5, h4;
    const r4 = this.constructor.\u03A0p(t4, s5);
    if (r4 !== void 0 && s5.reflect === true) {
      const n7 = ((h4 = (e5 = s5.converter) === null || e5 === void 0 ? void 0 : e5.toAttribute) !== null && h4 !== void 0 ? h4 : o4.toAttribute)(i4, s5.type);
      this.\u03A0h = t4, n7 == null ? this.removeAttribute(r4) : this.setAttribute(r4, n7), this.\u03A0h = null;
    }
  }
  K(t4, i4) {
    var s5, e5, h4;
    const r4 = this.constructor, n7 = r4.\u03A0m.get(t4);
    if (n7 !== void 0 && this.\u03A0h !== n7) {
      const t5 = r4.getPropertyOptions(n7), l4 = t5.converter, a4 = (h4 = (e5 = (s5 = l4) === null || s5 === void 0 ? void 0 : s5.fromAttribute) !== null && e5 !== void 0 ? e5 : typeof l4 == "function" ? l4 : null) !== null && h4 !== void 0 ? h4 : o4.fromAttribute;
      this.\u03A0h = n7, this[n7] = a4(i4, t5.type), this.\u03A0h = null;
    }
  }
  requestUpdate(t4, i4, s5) {
    let e5 = true;
    t4 !== void 0 && (((s5 = s5 || this.constructor.getPropertyOptions(t4)).hasChanged || n5)(this[t4], i4) ? (this.L.has(t4) || this.L.set(t4, i4), s5.reflect === true && this.\u03A0h !== t4 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t4, s5))) : e5 = false), !this.isUpdatePending && e5 && (this.\u03A0g = this.\u03A0q());
  }
  async \u03A0q() {
    this.isUpdatePending = true;
    try {
      for (await this.\u03A0g; this.\u03A0o; )
        await this.\u03A0o;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.performUpdate();
    return t4 != null && await t4, !this.isUpdatePending;
  }
  performUpdate() {
    var t4;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t5, i5) => this[i5] = t5), this.\u03A0i = void 0);
    let i4 = false;
    const s5 = this.L;
    try {
      i4 = this.shouldUpdate(s5), i4 ? (this.willUpdate(s5), (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
        var i5;
        return (i5 = t5.hostUpdate) === null || i5 === void 0 ? void 0 : i5.call(t5);
      }), this.update(s5)) : this.\u03A0$();
    } catch (t5) {
      throw i4 = false, this.\u03A0$(), t5;
    }
    i4 && this.E(s5);
  }
  willUpdate(t4) {
  }
  E(t4) {
    var i4;
    (i4 = this.\u03A0U) === null || i4 === void 0 || i4.forEach((t5) => {
      var i5;
      return (i5 = t5.hostUpdated) === null || i5 === void 0 ? void 0 : i5.call(t5);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  \u03A0$() {
    this.L = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this.\u03A0g;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t5, i4) => this.\u03A0j(i4, this[i4], t5)), this.\u03A0k = void 0), this.\u03A0$();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
a2.finalized = true, a2.shadowRootOptions = {mode: "open"}, (e4 = (s3 = globalThis).reactiveElementPlatformSupport) === null || e4 === void 0 || e4.call(s3, {ReactiveElement: a2}), ((h2 = (r3 = globalThis).reactiveElementVersions) !== null && h2 !== void 0 ? h2 : r3.reactiveElementVersions = []).push("1.0.0-pre.3");

// node_modules/lit-element/lit-element.js
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var i3;
var l3;
var o5;
var s4;
var n6;
var a3;
((i3 = (a3 = globalThis).litElementVersions) !== null && i3 !== void 0 ? i3 : a3.litElementVersions = []).push("3.0.0-pre.4");
var h3 = class extends a2 {
  constructor() {
    super(...arguments), this.renderOptions = {host: this}, this.\u03A6o = void 0;
  }
  createRenderRoot() {
    var t4, e5;
    const r4 = super.createRenderRoot();
    return (t4 = (e5 = this.renderOptions).renderBefore) !== null && t4 !== void 0 || (e5.renderBefore = r4.firstChild), r4;
  }
  update(t4) {
    const r4 = this.render();
    super.update(t4), this.\u03A6o = A(r4, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t4;
    super.connectedCallback(), (t4 = this.\u03A6o) === null || t4 === void 0 || t4.setConnected(true);
  }
  disconnectedCallback() {
    var t4;
    super.disconnectedCallback(), (t4 = this.\u03A6o) === null || t4 === void 0 || t4.setConnected(false);
  }
  render() {
    return x;
  }
};
h3.finalized = true, (o5 = (l3 = globalThis).litElementHydrateSupport) === null || o5 === void 0 || o5.call(l3, {LitElement: h3}), (n6 = (s4 = globalThis).litElementPlatformSupport) === null || n6 === void 0 || n6.call(s4, {LitElement: h3});

export {
  n,
  __getOwnPropDesc,
  s2 as s,
  h3 as h,
  y,
  x,
  T,
  __decorate
};
