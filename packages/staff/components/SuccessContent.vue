<template>
  <div class="success-content">
    <!-- <TextHeading /> -->
    <div class="icon _mgbt-24px">
      <i class="fas fa-check"></i>
    </div>

    <slot name="remark" />

    <h3 class="_fs-5 _tal-ct _mgt-24px _mgbt-24px" v-html="title"></h3>

    <slot name="content" />

    <!-- <sl-button type="primary" class="_w-100pct _mgt-32px"
      >Go to Application</sl-button
    > -->
    <v-sl-button
      type="primary"
      @click="handleBack"
      class="_w-100pct _mgt-32px"
      v-html="back.label"
    ></v-sl-button>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    date: {
      type: [String, Date],
      default: '',
    },
    user: {
      type: Object,
      default: null,
    },
    back: {
      type: Object,
      default: () => ({
        path: '/',
        label: 'Go Back',
      }),
    },
  },
  methods: {
    handleBack() {
      this.$store.commit('SET_BY_KEY', {
        key: 'scannerData',
        value: null
      })

      this.$store.commit('SET_BY_KEY', {
        key: 'pointsData',
        value: null
      })

      this.$router.push(this.back.path ? this.back.path : `/`)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  background: #76d650;
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
