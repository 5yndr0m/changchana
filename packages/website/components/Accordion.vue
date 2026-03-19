<template>
  <div class="accordion">
    <div class="head" @click="triggerAccordion">
      <h4 v-html="title"></h4>
      <div class="icon _fs-6" :class="{ '-active': open }">
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
    <div class="collapse" ref="accordion">
      <div class="wysiwyg" v-html="content">
      </div>
      <!-- <div class="wysiwyg" v-html="content"></div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    // open: {
    //   type: Boolean,
    //   default: '',
    // },
  },
  data: () => ({
    open: false,
  }),
  methods: {
    triggerAccordion() {
      this.open = !this.open
      let myCollapse = this.$refs.accordion
      let bsCollapse = new bootstrap.Collapse(myCollapse)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.accordion {
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding-top: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 8px;

    h4 {
      font-size: 1.175rem;

      @media screen and (max-width: $md) {
        font-size: 1rem;
      }
    }

    .icon {
      color: #999;
      transition: .3s;
      padding-right: 3px;

      &.-active {
        transform: rotate(-90deg);
        transition: .3s;
      }
    }
  }
}
</style>
