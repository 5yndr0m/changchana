import {
  e
} from "./chunk.43UCHSNT.js";
import {
  __decorate,
  h,
  n
} from "./chunk.MXDRQAVA.js";

// src/components/format-number/format-number.ts
var SlFormatNumber = class extends h {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.type = "decimal";
    this.noGrouping = false;
    this.currency = "USD";
    this.currencyDisplay = "symbol";
  }
  render() {
    if (isNaN(this.value)) {
      return "";
    }
    return new Intl.NumberFormat(this.locale, {
      style: this.type,
      currency: this.currency,
      currencyDisplay: this.currencyDisplay,
      useGrouping: !this.noGrouping,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumFractionDigits: this.minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      maximumSignificantDigits: this.maximumSignificantDigits
    }).format(this.value);
  }
};
__decorate([
  e({type: Number})
], SlFormatNumber.prototype, "value", 2);
__decorate([
  e()
], SlFormatNumber.prototype, "locale", 2);
__decorate([
  e()
], SlFormatNumber.prototype, "type", 2);
__decorate([
  e({attribute: "no-grouping", type: Boolean})
], SlFormatNumber.prototype, "noGrouping", 2);
__decorate([
  e()
], SlFormatNumber.prototype, "currency", 2);
__decorate([
  e({attribute: "currency-display"})
], SlFormatNumber.prototype, "currencyDisplay", 2);
__decorate([
  e({attribute: "minimum-integer-digits", type: Number})
], SlFormatNumber.prototype, "minimumIntegerDigits", 2);
__decorate([
  e({attribute: "minimum-fraction-digits", type: Number})
], SlFormatNumber.prototype, "minimumFractionDigits", 2);
__decorate([
  e({attribute: "maximum-fraction-digits", type: Number})
], SlFormatNumber.prototype, "maximumFractionDigits", 2);
__decorate([
  e({attribute: "minimum-significant-digits", type: Number})
], SlFormatNumber.prototype, "minimumSignificantDigits", 2);
__decorate([
  e({attribute: "maximum-significant-digits", type: Number})
], SlFormatNumber.prototype, "maximumSignificantDigits", 2);
SlFormatNumber = __decorate([
  n("sl-format-number")
], SlFormatNumber);
var format_number_default = SlFormatNumber;

export {
  format_number_default
};
