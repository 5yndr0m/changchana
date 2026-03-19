<template>
  <div>
    <label for="" v-html="label"></label>
    <sl-input :value="value" :disabled="disabled" @sl-input="e => $emit('input', e.target.value)" type="password"></sl-input>
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
