<template>
  <section class="hero" v-if="data">
    <div class="container-left _mgbt-0px-md _mgbt-64px">
      <div class="row _jtfct-spbtw">
        <div class="col-md-5">
          <h4
            class="section-hero-label _mgbt-24px _tal-l-md _tal-ct"
            v-html="data.label"
          ></h4>
          <h1
            class="_fs-1-md _fs-3 _mgbt-16px _tal-l-md _tal-ct"
            v-html="data.title"
          ></h1>
          <p class="_tal-l-md _tal-ct" v-html="data.description"></p>

          <div class="_dp-f _alit-ct _mgt-24px _jtfct-fst-md _jtfct-ct">
            <nuxt-link to="/signup" type="button" class="btn btn-primary _mgr-12px">ลงทะเบียน</nuxt-link>
            <nuxt-link to="/about" type="button" class="btn btn-outline-light">เกี่ยวกับเรา</nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="max-container">
      <div class="image">
        <img src="~assets/images/home/hero_bike.png" alt="" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  padding-top: 184px;
  padding-bottom: 280px;
  background-color: #001811;
  background-image: url('~assets/images/campaign_hero_bg.jpg');
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;
  position: relative;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 72px;
  }

  .max-container {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    top: 124px;
    pointer-events: none;

    @media screen and (max-width: $md) {
      position: relative;
      height: auto;
      top: initial;
      left: initial;
      transform: none;
      max-width: 540px;
      padding-left: 15px;
      padding-right: 15px;
    }

    .image {
      width: 660px;
      height: auto;
      position: absolute;
      top: 0;
      right: 0;

      @media screen and (max-width: $md) {
        position: relative;
        width: 100%;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
