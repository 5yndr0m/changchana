<template>
  <div>
    <label for="" v-html="label"></label>
    <sl-textarea :disabled="disabled" :value="value" @sl-input="e => $emit('input', e.target.value)"></sl-textarea>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
