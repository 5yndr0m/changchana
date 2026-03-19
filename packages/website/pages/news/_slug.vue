<template>
  <div>
    <section class="hero">
      <div class="container-right">
        <div class="row _alit-ct _jtfct-spbtw _fdrt-r-md _fdrt-clrv">
          <div class="col-md-7 _pst-rlt">
            <div
              class="image"
              :style="{
                backgroundImage: `url('${
                  pageData.cover_image ? pageData.cover_image.url : ''
                }')`,
              }"
            ></div>

            <div class="decoration">
              <img src="~assets/images/news/hero_dec.svg" alt="" />
            </div>
          </div>
          <div class="col-md-4 _mgbt-0px-md _mgbt-24px">
            <h1 class="_fs-2-md _fs-3 _mgbt-24px" v-html="pageData.title"></h1>
            <h4 class="section-hero-label">
              <span>{{ $moment(pageData.published_at).format('DD MMM YYYY') }}</span>
              <span> | </span>
              <span v-html="__calculateReadingTime(pageData ? pageData.content : '')"></span>
            </h4>
          </div>
        </div>
      </div>
    </section>

    <section class="content _mgbt-64px-md _mgbt-48px">
      <div class="container">
        <div class="wysiwyg" v-html="pageData.content"></div>

        <div class="content-footer">
          <div class="meta">
            <p>
              Published on
              <span
                v-html="$moment(pageData.published_at).format('DD MMMM YYYY')"
              ></span>
            </p>
          </div>
          <div class="share">
            <p>Share to</p>
            <div class="a2a_kit a2a_kit_size_32 a2a_default_style socials">
              <a class="a2a_button_facebook">
                <i class="fab fa-facebook"></i>
              </a>
              <a class="a2a_button_twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a class="a2a_button_line">
                <i class="fab fa-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="decoration -middle">
        <img src="~assets/images/news/hero_dec.svg" alt="" />
      </div>
      <div class="decoration -bottom">
        <img src="~assets/images/news/hero_dec.svg" alt="" />
      </div>
    </section>

    <CallToAction />
  </div>
</template>

<script>
export default {
  layout: 'main',
  async asyncData({ $axios, params, redirect }) {
    let { slug } = params

    if (!slug) return redirect('/news')

    let response = await $axios.$get(
      `/articles?slug=${encodeURIComponent(slug)}`
    )

    if (!response.length) return redirect('/news')

    return {
      pageData: response[0],
    }
  },
  head() {
    let seoData = this.$store.state.settings.seo
    let title = this.pageData.title ? this.pageData.title : seoData.title || ''
    let description = this.pageData.excerpt
      ? this.pageData.excerpt
      : seoData.description
    // let keywords = seoData.keywords || ''

    let image
    if (this.pageData.cover_image) {
      image = this.pageData.cover_image.url
    } else {
      if (seoData.image) {
        image = seoData.image.url
      } else {
        image = ''
      }
    }

    return {
      title: title,
      meta: [
        {
          hid: 'title',
          property: 'title',
          content: title,
        },
        {
          hid: 'description',
          property: 'description',
          content: description,
        },
        // {
        //   hid: 'keywords',
        //   property: 'keywords',
        //   content: keywords,
        // },
        // Open Graph
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        // Twitter Card
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: image,
        },
        {
          hid: 'twitter:image:',
          name: 'twitter:image:alt',
          content: 'Chongjaroen',
        },
      ],
    }
  },
  mounted() {
    setTimeout(() => {
      if (a2a) a2a.init_all()
    }, 0)
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.hero {
  padding-top: 164px;
  padding-bottom: 84px;
  background-color: #001811;
  background-image: url('~assets/images/campaign_hero_bg.jpg');
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 24px;
  }

  .image {
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
    bottom: -40px;
    right: -50px;

    @media screen and (max-width: $md) {
      display: none;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .container-right {
    .col-md-7 {
      @media screen and (max-width: $md) {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}

.content {
  position: relative;

  .container {
    max-width: 730px;
    position: relative;
    z-index: 5;
  }

  .decoration {
    position: absolute;

    @media screen and (max-width: $md) {
      display: none;
    }

    &.-middle {
      top: 50%;
      transform: translateY(-50%);
      left: -90px;
    }

    &.-bottom {
      bottom: 0;
      right: -90px;
    }
  }
}
</style>
