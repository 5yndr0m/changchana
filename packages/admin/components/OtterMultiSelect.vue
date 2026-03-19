<template>
  <div class="otter-multi-select">
    <div
      class="base"
      :class="{ '-active': optionsActive }"
      @click="optionsActive ? handleBlur() : handleFocus()"
      @blur="handleBlur"
    >
      <div class="selected-options">
        <draggable :list="value" class="draggable">
          <div
            class="option"
            v-for="(val, i) in value"
            :key="`selected-option-${i}`"
          >
            <span v-html="val.label"></span>
            <div class="remove" @click="removeItem(i)">
              <i class="fas fa-times"></i>
            </div>
          </div>
        </draggable>
        <input
          type="text"
          ref="newOptionInput"
          @input="e => $emit('search', e.target.value)"
          @blur="handleBlur"
        />
      </div>
    </div>
    <div class="options" v-if="optionsActive">
      <div
        class="option"
        v-for="(val, i) in _options"
        :key="`option-${i}`"
        v-html="val.label"
        @mousedown="handleMousedown(val)"
      ></div>
      <div class="empty" v-if="!_options.length">
        There is no available options
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: null,
    },
    value: {
      type: [Object, String, Array],
      default: null,
    },
  },
  computed: {
    _options() {
      let value = this.value.map(val => val.value)
      return this.options.filter(val => !value.includes(val.value))
    },
  },
  data: () => ({
    optionsActive: false,
  }),
  methods: {
    handleFocus() {
      this.optionsActive = true
      this.$refs.newOptionInput.focus()
    },
    handleBlur() {
      this.optionsActive = false
      this.$emit('search', '')
    },
    handleMousedown(val) {
      this.optionsActive = true
      let newData = [...this.value, val]
      this.$emit('input', newData)
      this.$refs.newOptionInput.value = ''
      this.$emit('search', '')
      this.optionsActive = false
    },
    removeItem(i) {
      let data = this.value
      data.splice(i, 1)
      this.$emit('input', data)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.otter-multi-select {
  width: 100%;
  position: relative;

  div {
    &.base {
      min-height: 40px;
      background-color: Rgb(var(--sl-input-background-color));
      border: solid var(--sl-input-border-width) Rgb(var(--sl-input-border-color));
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

      > .selected-options {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .draggable {
          display: flex;
          flex-wrap: wrap;

          .option {
            font-size: 12px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            background: $primary-color;
            color: #fff;
            display: flex;
            align-items: center;
            margin: 0px 4px 8px 4px;
            outline: none;

            > .remove {
              font-size: 11px;
              margin-left: 8px;
              cursor: pointer;
            }
          }
        }

        input {
          width: auto;
          min-width: none;
          height: auto;
          min-height: none;
          background: transparent;
          border: none;
          outline: none;
          margin-bottom: 8px;
          padding: 0 8px;
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
      }

      > .empty {
        padding: 10px var(--sl-input-spacing-medium);
        text-align: center;
      }
    }
  }
}
</style>
