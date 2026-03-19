<template>
  <div class="percent-bar row">
    <div class="col-md-8 _bgcl-gray-300 _bdrd-24px _pdl-0px _pdr-0px">
      <div class="bar" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="col-md-4 _pdl-0px ">
      <div class="label">{{ percent }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";
.percent-bar {
  display: flex;
  align-items: center;
}

.bar {
  height: 8px;
  background-color: $primary-color;
  border-radius: 24px;
}

.label {
  margin-left: 10px;
}
</style>