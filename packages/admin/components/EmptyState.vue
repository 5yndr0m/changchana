<template>
  <div class="empty-state">
    <div class="main-icon _fs-4-md _fs-5"><i class="fas fa-box-open"></i></div>
    <h4 class="_mgt-12px _fs-4-md _fs-5">{{prefixLabel}} {{label}}</h4>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Entry'
    },
    prefixLabel: {
      type: String,
      default: 'ยังไม่มี'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.empty-state {
  padding: 48px;
  background: #fff;
  box-shadow: $card-shadow;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
}
</style>