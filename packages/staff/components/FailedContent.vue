<template>
  <div class="success-content">
    <!-- <TextHeading /> -->
    <div class="icon _mgbt-24px">
      <i class="fas fa-times"></i>
    </div>
    <h3 class="_fs-5 _tal-ct _mgt-24px _mgbt-24px" v-html="title"></h3>
    <slot />
    <!-- <sl-button type="primary" class="_w-100pct _mgt-32px"
      >Go to Application</sl-button
    > -->
    <v-sl-button
      type="primary"
      :href="back.path ? back.path : `/`"
      class="_w-100pct _mgt-32px"
      v-html="back.label"
    ></v-sl-button>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    back: {
      type: Object,
      default: () => ({
        path: '/',
        label: 'Go Back',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  background: #CB2731;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    font-size: 32px;
    color: #fff;
  }
}
</style>
