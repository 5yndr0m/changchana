<template>
  <div></div>
</template>

<script>
export default {
  middleware ({ redirect }) {
    redirect('/account')
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';
</style>
