<template>
  <div>
    <label for="" v-html="label"></label>
    <sl-input :value="value" :disabled="disabled" @sl-input="e => $emit('input', e.target.value)" type="number"></sl-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: 0,
    },
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
