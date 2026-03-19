<template>
  <div class="text-heading">
    <h2 v-html="title" :class="{ '-small': small }"></h2>
    <div class="divider _mgt-16px"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.text-heading {
  text-align: center;

  h2 {
    font-size: 24px;
    text-align: center;

    &.-small {
      font-size: 20px;
    }
  }

  .divider {
    width: 32px;
    height: 4px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background: #1797ad;
  }
}
</style>