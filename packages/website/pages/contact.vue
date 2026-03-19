<template>
  <div>
    <section class="hero">
      <div class="container-right">
        <div class="row _alit-ct _jtfct-spbtw _fdrt-r-md _fdrt-clrv">
          <div class="col-md-7 _pst-rlt _mgt-0px-md _mgt-64px">
            <div class="image"></div>
            <div class="character">
              <img src="~assets/images/contact/hero_model.png" alt="" />
            </div>
          </div>
          <div class="col-md-4 _mgbt-0px-md _mgbt-24px _pdh-0px-md _pdh-32px">
            <h4
              class="section-hero-label _tal-l-md _tal-ct _mgbt-24px"
              v-html="pageData.hero.label"
            ></h4>
            <h1
              class="_fs-2-md _fs-3 _mgbt-16px _tal-l-md _tal-ct"
              v-html="pageData.hero.title"
            ></h1>
            <p class="_tal-l-md _tal-ct" v-html="pageData.hero.description"></p>

            <div class="_dp-f _jtfct-fst-md _jtfct-ct _mgt-24px">
              <a href="https://page.line.me/?accountId=gns5260o" target="_blank" rel="noopener noreferrer" re class="btn btn-primary">ส่งข้อความถึงเรา</a>
              <a href="https://page.line.me/?accountId=018iwpam" target="_blank" rel="noopener noreferrer" class="btn btn-link">ติดต่อสมัครงาน</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="branches _mgbt-24px-md" v-if="branches">
      <div class="container">
        <div class="heading _mgbt-48px">
          <h2>สาขาของเรา</h2>
        </div>

        <div class="row _dp-f-sm _dp-n">
          <div
            class="col-sm-4 col-6 _mgbt-48px"
            v-for="(val, i) in branches"
            :key="`branch-${i}`"
          >
            <BranchCard
              :name="val.name"
              :phone="val.phone"
              :line="val.line"
              :map="val.google_map"
              :logo="val.logo ? val.logo.url : ''"
            />
          </div>
        </div>
      </div>

      <div class="_dp-n-sm">
        <client-only>
          <swiper :options="swiperOptions" class="branches-swiper">
            <swiper-slide
              v-for="(val, i) in branches"
              :key="`mobile-branch-${i}`"
            >
              <BranchCard
                :name="val.name"
                :phone="val.phone"
                :line="val.line"
                :map="val.google_map"
                :logo="val.logo ? val.logo.url : ''"
                class="_pdh-16px"
              />
            </swiper-slide>

            <div class="swiper-pagination _mgt-32px" slot="pagination"></div>
          </swiper>
        </client-only>
      </div>
    </section>

    <CallToAction />
  </div>
</template>

<script>
import BranchCard from '~/components/landing/contact/BranchCard'

export default {
  head() {
    return {
      title: 'ติดต่อเรา',
    }
  },
  layout: 'main',
  components: {
    BranchCard,
  },
  async asyncData({ $axios }) {
    let response = await $axios.$get(`/contact-page`)

    return {
      pageData: response,
    }
  },
  data: () => ({
    swiperOptions: {
      pagination: {
        el: '.swiper-pagination',
      },
      slidesPerView: '1.3',
      breakpoints: {
        540: {
          slidesPerView: '2.3',
        },
      },
      // Some Swiper option/callback...
    },
    branches: null,
  }),
  async mounted() {
    try {
      let response = await this.$axios.$get(`/branches`)
      this.branches = response
    } catch (err) {
      console.log(err)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  padding-top: 204px;
  padding-bottom: 84px;
  background-color: #001811;
  background-image: url('~assets/images/campaign_hero_bg.jpg');
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;
  position: relative;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 24px;
  }

  .image {
    width: 100%;
    height: 488px;
    // padding-top: 56.25%;
    background-color: #e2e2e2;
    background-image: url('~assets/images/contact/hero_bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 5;
    border-radius: 0px 60px 30px 0px;

    @media screen and (max-width: $md) {
      border-radius: 0;
      height: 393px;
    }
  }

  .character {
    position: absolute;
    width: 301px;
    bottom: 0;
    right: 72px;
    z-index: 5;
    line-height: 0;

    @media screen and (max-width: $md) {
      width: 246px;
      right: initial;
      left: 50%;
      transform: translateX(-50%);
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .col-md-7 {
    @media screen and (max-width: $md) {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.branches {
  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin-right: 16px;
    }

    &:after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.contact-button {
  &::part(base) {
    color: #fff;
  }

  &::part(label) {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>
