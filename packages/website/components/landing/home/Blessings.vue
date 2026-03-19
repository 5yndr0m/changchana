<template>
  <section class="blessings" v-if="data">
    <div class="container">
      <div class="blessing-wrapper -top">
        <div class="blessing">
          <img src="~assets/images/home/japanese.png" alt="" />
        </div>
        <div class="blessing -right">
          <img src="~assets/images/home/chinese.png" alt="" />
        </div>
      </div>
    </div>
    <div class="container content-container _mgv-32px">
      <div class="row _mgbt-24px">
        <div class="col-md-6">
          <h2 class="_fs-2-md _fs-3 _tal-l-md _tal-ct" v-html="data.title">
          </h2>
        </div>
      </div>
      <div class="row _jtfct-fe">
        <div class="col-md-6">
          <p class="_tal-l-md _tal-ct" v-html="data.description"></p>
          <div class="_dp-f _jtfct-fst-md _jtfct-ct _mgt-24px">
            <nuxt-link to="/about" type="button" class="btn btn-primary">เกี่ยวกับเรา</nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="blessing-wrapper -bottom">
        <div class="blessing">
          <img src="~assets/images/home/arabic.png" alt="" />
        </div>
        <div class="blessing -right">
          <img src="~assets/images/home/hawaiian.png" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.blessings {
  padding-top: 128px;
  padding-bottom: 128px;

  @media screen and (max-width: $md) {
    padding-top: 72px;
    padding-bottom: 72px;
  }

  .blessing-wrapper {
    .blessing {
      @media screen and (max-width: $md) {
        margin-left: auto !important;
        margin-right: auto !important;
        margin-bottom: 16px;

        &:last-of-type {
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>
