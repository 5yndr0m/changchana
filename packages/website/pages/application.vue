<template>
  <div>
    <section class="hero" v-if="pageData">
      <div class="container">
        <div class="row">
          <div class="col-md-6 content _tal-l-md _tal-ct">
            <h1
              class="_fs-2-md _fs-3 _mgbt-24px-md _mgbt-12px"
              v-html="pageData.hero.title"
            ></h1>
            <p class="_mgbt-32px" v-html="pageData.hero.description"></p>

            <div class="_dp-f _alit-ct _jtfct-fst-md _jtfct-ct image">
              <nuxt-link class="btn btn-primary" to="/signup">ลงทะเบียน</nuxt-link>
            </div>

            <div class="features _mgt-48px">
              <div
                class="features-item"
                v-for="(val, i) in pageData.hero.features"
                :key="`feature-${i}`"
              >
                <div class="icon">
                  <i class="fas" :class="[`fa-${val.icon}`]"></i>
                </div>
                <h4 v-html="val.label"></h4>
              </div>
            </div>
          </div>

          <div class="col-md-6 _dp-f _jtfct-ct _alit-fe">
            <div class="phone-wrapper">
              <img src="~assets/images/phone_upper.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="content" v-if="pageData">
      <div class="container">
        <div class="row _fdrt-r-md _fdrt-clrv">
          <div class="col-md-6 _pdv-48px">
            <Accordion v-for="(val, i) in pageData.faq" :key="`faq-${i}`" :title="`${i + 1}. ${val.title}`" :content="val.description" class="_mgbt-16px" />
          </div>

          <div class="col-md-6">
            <div class="_dp-f _jtfct-ct">
              <div class="phone-wrapper">
                <img src="~assets/images/phone_lower.png" alt="" />
              </div>
            </div>

            <div class="stores-wrapper _mgv-48px-md _mgt-48px">
              <div class="stores-item">
                <a href="https://apps.apple.com/th/app/chongchana/id1565665305" target="_blank" rel="noopener noreferrer">
                  <img src="~assets/images/app_store.png" alt="" />
                </a>
              </div>

              <div class="stores-item">
                <a href="https://play.google.com/store/apps/details?id=com.chongjaroen.app&fbclid=IwAR33989QaLWjoQrSG8j8G1nwj-Dp7yNHmi69QAII0HB-DedKY9ZOnojjIwc" target="_blank" rel="noopener noreferrer">
                  <img src="~assets/images/google_play.png" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'แอปพลิเคชั่น',
    }
  },
  async asyncData({ $axios }) {
    let response = await $axios.$get(`/landing-page`)

    return {
      pageData: response,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  background: linear-gradient(to bottom, rgba(#063f48, 1), rgba(#063f48, 0) 14%),
    url('~assets/images/hero_bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;

  .content {
    padding-top: 96px;
    padding-bottom: 96px;

    @media screen and (max-width: $md) {
      padding-top: 32px;
      padding-bottom: 70px;
    }

    a {
      color: inherit;
      text-decoration: none;
      font-weight: 700;
    }

    .features {
      display: flex;
      justify-content: space-between;

      @media screen and (max-width: $md) {
        justify-content: center;
      }

      .features-item {
        display: flex;
        align-items: center;
        flex: 0 0 33.33%;

        @media screen and (max-width: $md) {
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }

        .icon {
          margin-right: 20px;
          width: 48px;
          height: 48px;
          border-radius: 100%;
          background: rgba(#fff, 0.13);
          display: flex;
          justify-content: center;
          align-items: center;

          @media screen and (max-width: $md) {
            margin-right: 0;
            margin-bottom: 12px;
          }
        }

        h4 {
          font-size: 16px;
        }
      }
    }
  }
}

.phone-wrapper {
  width: 100%;
  max-width: 350px;
  line-height: 0;

  @media screen and (max-width: $md) {
    max-width: 300px;
  }

  img {
    width: 100%;
    height: auto;
  }
}

.stores-wrapper {
  display: flex;
  justify-content: center;

  @media screen and (max-width: $md) {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  > .stores-item {
    flex: 0 0 33.33%;
    padding-left: 12px;
    padding-right: 12px;

    @media screen and (max-width: $md) {
      flex: 0 0 50%;
    }

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
