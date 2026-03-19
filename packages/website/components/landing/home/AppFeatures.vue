<template>
  <section class="app-features" v-if="data">
    <div class="container">
      <div class="row _jtfct-spbtw _alit-fe _fdrt-r-md _fdrt-clrv">
        <div class="col-md-5 image-wrapper">
          <div class="image">
            <img src="~assets/images/home/features_mobile_mockup.png" alt="" />

            <div class="decoration -left">
              <img src="~assets/images/home/phone_dec_left.png" alt="">
            </div>

            <div class="decoration -right">
              <img src="~assets/images/home/phone_dec_right.png" alt="">
            </div>
          </div>
        </div>
        <div class="col-md-6 _mgbt-0px-md _mgbt-32px">
          <div class="_pdbt-32px">
            <h4 class="section-hero-label _mgbt-24px _tal-l-md _tal-ct" v-html="data.label">
            </h4>
            <h2 class="_fs-2-md _fs-4 _mgbt-16px _tal-l-md _tal-ct" v-html="data.title">
            </h2>
            <p class="_tal-l-md _tal-ct" v-html="data.description">
            </p>

            <div class="features _mgv-32px" v-if="data.app_features">
              <div v-for="(val, i) in data.app_features" :key="`app-feature-${i}`">
                <div class="icon">
                  <i class="fas" :class="[`fa-${val.icon}`]"></i>
                </div>
                <h5 v-html="val.title"></h5>
              </div>
            </div>

            <div class="_dp-f _jtfct-fst-md _jtfct-ct">
              <nuxt-link class="btn btn-primary" to="/application">อ่านเพิ่มเติม</nuxt-link>
            </div>
          </div>
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

.app-features {
  margin-top: -90px;

  @media screen and (max-width: $md) {
    margin-top: 0;
  }

  .container {
    position: relative;

    &:after {
      content: '';
      width: 100%;
      height: calc(100% - 48px);
      background: linear-gradient(
        180deg,
        #053b42 0%,
        rgba(5, 59, 66, 0) 79.51%
      );
      bottom: 0;
      left: -100%;
      position: absolute;
    }
  }

  .image-wrapper {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: calc(100% - 48px);
      left: 0;
      bottom: 0;
      background: linear-gradient(
        180deg,
        #053b42 0%,
        rgba(5, 59, 66, 0) 79.51%
      );
      border-radius: 0 60px 0 0;

      @media screen and (max-width: $md) {
        left: -15px;
      }
    }

    .image {
      width: 100%;
      max-width: 301px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 5;

      @media screen and (max-width: $md) {
        max-width: 246px;
      }

      img {
        width: 100%;
        height: auto;
      }
    }

    .decoration {
      position: absolute;

      img {
        width: 100%;
        height: auto;
      }

      &.-left {
        width: 60px;
        height: auto;
        top: 80px;
        left: -70px;

        @media screen and (max-width: $md) {
          left: -55px;
        }
      }

      &.-right {
        width: 30px;
        height: auto;
        bottom: 40px;
        right: -30px;

        @media screen and (max-width: $md) {
          right: -25px;
        }
      }
    }
  }

  .features {
    display: flex;
    margin-left: -15px;
    margin-right: -15px;

    > div {
      flex: 1;
      display: flex;
      align-items: center;
      padding-left: 15px;
      padding-right: 15px;

      @media screen and (max-width: $md) {
        display: block;
      }

      .icon {
        width: 48px;
        height: 48px;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 14px;
        margin-right: 16px;

        @media screen and (max-width: $md) {
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 8px;
        }
      }

      h5 {
        font-size: 16px;

        @media screen and (max-width: $md) {
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
