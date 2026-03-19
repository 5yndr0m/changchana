<template>
  <div class="otter-select" v-click-outside="handleBlur">
    <div
      class="base"
      :class="{ '-active': optionsActive, '-disabled': disabled }"
      @click="optionsActive ? handleBlur() : handleFocus()"
      @blur="handleBlur"
    >
      <template v-if="search">
        <input
          type="text"
          ref="newOptionInput"
          @input="(e) => $emit('search', e.target.value)"
          @blur="handleBlur"
          v-if="!value || optionsActive"
        />
        <span v-else v-html="value.label"></span>
      </template>

      <span
        v-else
        v-html="value ? value.label : placeholder"
        :class="{ '-placeholder': !value }"
      ></span>

      <div class="chevron" :class="{ '-active': optionsActive }">
        <i class="far fa-chevron-down"></i>
      </div>
    </div>
    <div class="options" v-if="optionsActive">
      <div
      v-for="(val, i) in options"
        :class="{ 'option': true, '-disabled': val.disabled }"
        :key="`option-${i}`"
        v-html="val.label"
        @mousedown="!val.disabled ? handleMousedown(val) : null"
      ></div>
      <div class="empty" v-if="!options.length">
        There is no available options
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "Select one",
    },
    search: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: null,
    },
    value: {
      type: [Object, String, Array],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      optionsActive: false,
    };
  },
  methods: {
    handleFocus() {
      if (this.disabled) {
        return;
      }
      this.optionsActive = true;

      if (this.search) {
        setTimeout(() => this.$refs.newOptionInput.focus(), 200);
      }
    },
    handleBlur() {
      if (this.disabled) {
        return;
      }
      this.optionsActive = false;
      if (this.search) this.$emit("search", "");
    },
    handleMousedown(val) {
      this.optionsActive = true;
      this.$emit("ot-input", val);
      if (this.search) {
        this.$refs.newOptionInput.value = "";
        this.$emit("search", "");
      }
      this.optionsActive = false;
    },
    removeItem(i) {
      let data = this.value;
      data.splice(i, 1);
      this.$emit("ot-input", data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.otter-select {
  width: 100%;
  position: relative;

  div {
    &.base {
      min-height: 40px;
      background-color: Rgb(var(--sl-input-background-color));
      border: solid var(--sl-input-border-width)
        Rgb(var(--sl-input-border-color));
      color: Rgb(var(--sl-input-color));
      padding: 8px var(--sl-input-spacing-medium) 0px
        var(--sl-input-spacing-medium);
      border-radius: var(--sl-input-border-radius-medium);
      outline: none;
      transition: var(--sl-transition-fast) color,
        var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow;
      cursor: pointer;

      &.-active {
        background-color: Rgb(var(--sl-input-background-color-focus));
        border-color: Rgb(var(--sl-input-border-color-focus));
        box-shadow: var(--sl-focus-ring);
        outline: none;
        color: Rgb(var(--sl-input-color-focus));
      }

      &.-disabled {
        opacity: 0.5;
      }

      > input {
        width: auto;
        min-width: none;
        height: auto;
        min-height: none;
        background: transparent;
        border: none;
        outline: none;
        margin-bottom: 8px;
        padding: 0;
      }

      > span {
        color: $heading-text-color !important;
        pointer-events: none;

        &.-placeholder {
          color: $paragraph-text-color !important;
        }
      }

      > .chevron {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transform-origin: center;
        right: 12px;
        transition: 0.3s;

        &.-active {
          transform: translateY(-50%) rotate(180deg);
        }
      }
    }

    &.options {
      position: absolute;
      top: calc(100% + 2px);
      z-index: 888;
      background: #fff;
      border: 1px solid $card-border-color;
      width: 100%;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;

      > .option {
        padding: 10px var(--sl-input-spacing-medium);
        border-bottom: 1px solid $card-border-color;
        transition: 0.4s;
        cursor: pointer;

        &:hover {
          background: $bg-dark-gray;
          transition: 0.4s;
        }

        &:last-of-type {
          border-bottom: none;
        }

        &.-disabled {
          cursor: not-allowed;
          background-color: #F7FAFC;
          color: #D3D3D3;
        }
      }

      > .empty {
        padding: 10px var(--sl-input-spacing-medium);
        text-align: center;
      }
    }
  }
}
</style>
