<template>
  <div class="call-to-action" v-if="_callToAction">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h4 class="_fs-2-md _fs-3 _mgbt-16px _tal-l-md _tal-ct" v-html="_callToAction.title"></h4>
          <p class="_mgbt-24px _tal-l-md _tal-ct" v-html="_callToAction.description">
          </p>

          <div class="button-wrapper">
            <nuxt-link class="btn btn-primary _mgr-16px" to="/signup">ลงทะเบียน</nuxt-link>
            <nuxt-link class="btn btn-outline-light" to="/application">แอปพลิเคชัน</nuxt-link>
          </div>
        </div>
      </div>

      <div class="roof-mobile">
        <img src="~assets/images/cta_roof_mobile.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    _callToAction() {
      return this.$store.state.settings.call_to_action
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.call-to-action {
  padding-top: 103px;
  padding-bottom: 103px;
  background: linear-gradient(180deg, rgba(18, 35, 38, 0) 0%, rgba(18, 35, 38, 0.6) 100%), #001811;
  position: relative;

  @media screen and (max-width: $md) {
    padding-top: 72px;
    padding-bottom: 0;
  }

  .container {
    position: relative;
    z-index: 10;
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('~assets/images/cta_roof.png');
    background-size: 660px auto;
    background-position: bottom right;
    background-repeat: no-repeat;
    top: 0; right: 0;

    @media screen and (max-width: $md) {
      display: none;
    }
  }

  .button-wrapper {
    display: flex;

    @media screen and (max-width: $md) {
      justify-content: center;
    }
  }

  .roof-mobile {
    display: none;
    width: 100%;
    height: auto;
    margin-top: 48px;

    @media screen and (max-width: $md) {
      display: block;

      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>