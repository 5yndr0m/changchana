<template>
  <sl-button v-bind="$props" @click="handleClick">
    <slot />
  </sl-button>
</template>

<script>
export default {
  props: {
    caret: Boolean,
    circle: Boolean,
    disabled: Boolean,
    download: String,
    href: String,
    loading: Boolean,
    name: String,
    pill: Boolean,
    size: String,
    submit: Boolean,
    target: String,
    type: String,
    value: String,
  },
  methods: {
    handleClick (e, magic) {
      e.preventDefault()
      if (this.href) {
        this.$router.push(this.href)
        return
      } else {
        this.$emit('click', e)
        return
      }
    }
  }
}
</script>
