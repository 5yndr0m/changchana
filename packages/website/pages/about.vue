<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="blessings">
          <div class="blessing-wrapper -top">
            <div class="blessing">
              <img src="~assets/images/home/japanese.png" alt="" />
            </div>
            <div class="blessing -right">
              <img src="~assets/images/home/chinese.png" alt="" />
            </div>
          </div>
        </div>
        <div class="row _alit-ct">
          <div class="col-md-4">
            <h4
              class="section-hero-label _tal-l-md _tal-ct _mgbt-24px"
              v-html="pageData.hero.label"
            ></h4>
            <h1
              class="_fs-1-md _fs-3 _mgv-12px _tal-l-md _tal-ct"
              v-html="pageData.hero.title"
            ></h1>
            <p
              class="_mgbt-24px _tal-l-md _tal-ct"
              v-html="pageData.hero.description"
            ></p>
          </div>
          <div class="col-md-8">
            <div
              class="image"
              :style="{
                backgroundImage: `url('${
                  pageData.hero.cover_image ? pageData.hero.cover_image.url : ''
                }')`
              }"
            ></div>
          </div>
        </div>
        <div class="blessings">
          <div class="blessing-wrapper -bottom">
            <div class="blessing">
              <img src="~assets/images/home/arabic.png" alt="" />
            </div>
            <div class="blessing -right">
              <img src="~assets/images/home/hawaiian.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="decoration">
        <img src="~assets/images/news/hero_dec.svg" alt="" />
      </div>
    </section>

    <!-- Content -->
    <section class="content-affix _mgt-48px">
      <div class="container">
        <ul class="mobile-menu _dp-n-md _mgv-32px">
          <li
            v-for="(val, i) in pageData.contents"
            :key="`content-mobile-menu-${i}`"
            v-scroll-to="`#content-${i}`"
          >
            <span v-html="val.title"></span>
            <i class="fas fa-arrow-right"></i>
          </li>
        </ul>

        <div class="row">
          <div class="col-md-4 _dp-b-md _dp-n">
            <affix
              class="sidebar-menu"
              relative-element-selector="#main-content"
            >
              <scrollactive>
                <a
                  :href="`#content-${i}`"
                  v-for="(val, i) in pageData.contents"
                  :key="`content-menu-${i}`"
                  v-html="val.title"
                  class="scrollactive-item"
                ></a>
              </scrollactive>
            </affix>
          </div>
          <div class="col-md-8" id="main-content">
            <div
              class="wysiwyg _mgbt-48px"
              v-for="(val, i) in pageData.contents"
              :id="`content-${i}`"
              :key="`content-${i}`"
              v-html="val.content"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <CallToAction />
  </div>
</template>

<script>
export default {
	head() {
		return {
			title: 'เกี่ยวกับเรา'
		}
	},
  layout: 'main',
  async asyncData({ $axios }) {
    let response = await $axios.$get(`/about-page`)

    return {
      pageData: response
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  padding-top: 164px;
  background-color: #001811;
  background-image: url('~assets/images/campaign_hero_bg.jpg');
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;
  position: relative;
  overflow-x: hidden;

  @media screen and (max-width: $md) {
    padding-top: 84px;
  }

  .image {
    width: 100%;
    height: auto;
    padding-top: 56.25%;
    border-radius: 5px;
    background-color: #e2e2e2;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .blessings {
    .blessing-wrapper {
      &.-top {
        margin-bottom: 8px;
      }

      &.-bottom {
        margin-top: -32px;

        @media screen and (max-width: $md) {
          margin-top: 32px;
        }
      }

      .blessing {
        @media screen and (max-width: $md) {
          width: 128px;
        }
      }
    }
  }

  .decoration {
    width: 180px;
    height: auto;
    position: absolute;
    top: 50%;
    transform: translateY(-25%);
    right: -120px;

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
