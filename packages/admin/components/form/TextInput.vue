<template>
  <div>
    <label for="" v-html="label"></label>
    <sl-input :placeholder="placeholder" :disabled="disabled" :value="value" :clearable="clearable" :maxlength="maxlength"
      @sl-input="e => $emit('input', e.target.value)"
      @sl-clear="e => $emit('clear', e.target.value)"
    >
      <i v-if="prefixIcon" class="fas _mgl-12px" :class="[`fa-${prefixIcon}`]" slot="prefix"></i>
    </sl-input>
  </div>
</template>

<script>
export default {
  props: {
    clearable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    prefixIcon: {
      type: String,
    },
    maxlength: {
      type: String,
    },
  },
}
</script>
