<template>
  <div>
    <label v-html="label">
      </label>
      <div>
        <sl-switch :checked="value" @sl-change="e => $emit('input', e.target.checked)"></sl-switch>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    switchLabel: String,
  },
}
</script>
