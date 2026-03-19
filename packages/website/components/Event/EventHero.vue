<template>
  <div>
    <section class="hero">
      <div class="container">
        <div class="row _alit-ct _jtfct-spbtw _fdrt-r-md _fdrt-clrv">
          <div class="col-md-7">
            <div class="image_hero" :style="{
              backgroundImage: `url('${this.cover_image}')`,
            }"></div>

            <div class="decoration">
              <img src="~assets/images/news/hero_dec.svg" alt="" />
            </div>
          </div>
          <div class="col-md-4 _mgbt-0px-md _mgbt-24px">
            <h4 class="section-hero-label _tal-l-md _tal-ct _mgbt-24px" v-html="this.label"></h4>
            <h1 class="_fs-2-md _fs-3 _mgbt-16px _tal-l-md _tal-ct" v-html="this.title"></h1>
            <p class="_tal-l-md _tal-ct" v-html="this.description"></p>
            <div class="_dp-f _jtfct-fst-md _jtfct-ct _mgt-24px" v-if="this.url">
              <a :href="this.url" type="button" class="btn btn-primary _mgr-12px">อ่านต่อ</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    cover_image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  padding-top: 164px;
  padding-bottom: 84px;
  background-color: #001811;
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 24px;
  }

  .image_hero {
    width: 100%;
    height: auto;
    padding-top: 56.25%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #e2e2e2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    z-index: 5;

    @media screen and (max-width: $md) {
      border-radius: 0;
    }
  }

  .decoration {
    position: absolute;
    width: 180px;
    height: auto;
    bottom: 60px;
    right: -75px;

    @media screen and (max-width: $md) {
      display: none;
    }

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>