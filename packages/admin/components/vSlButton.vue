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
    size: {
      type: String,
      default: 'medium'
    },
    submit: Boolean,
    target: String,
    type: String,
    value: String,
  },
  methods: {
    handleClick (e, magic) {
      if (this.href) {
        e.preventDefault()
        
        this.$router.push(e.target.href)
        return
      } else {
        this.$emit('click', e)
        return
      }
    }
  }
}
</script>
