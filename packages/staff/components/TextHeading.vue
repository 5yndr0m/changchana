<template>
  <div class="text-heading">
    <h2 v-html="title"></h2>
    <div class="divider _mgt-16px"></div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped>
.text-heading {
  text-align: center;

  h2 {
    font-size: 24px;
    text-align: center;
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