<template>
  <section class="latest-news" v-if="data">
    <div class="container">
      <h4
        class="section-hero-label _mgbt-12px _tal-l-md _tal-ct"
        v-html="data.label"
      ></h4>
      <div class="_dp-f-md _jtfct-spbtw _alit-ct _mgbt-48px">
        <h2 class="_fs-2-md _fs-3 _tal-l-md _tal-ct" v-html="data.title"></h2>
        <nuxt-link class="btn btn-outline-light _dp-ilb-md _dp-n" to="/news">ดูทั้งหมด</nuxt-link>
      </div>

      <div class="row" v-if="news">
        <div
          class="col-md-4 _mgbt-0px-md _mgbt-32px"
          v-for="(val, i) in news"
          :key="`news-${i}`"
        >
          <NewsCard
            :title="val.title"
            :excerpt="val.excerpt"
            :image="val.cover_image ? val.cover_image.url : ''"
            :to="`/news/${val.slug}`"
            :special="val.special"
          />
        </div>
      </div>

      <div class="_dp-n-md _dp-f _jtfct-ct _alit-ct _mgt-32px">
        <nuxt-link class="btn btn-outline-light" to="/news">ดูทั้งหมด</nuxt-link>
      </div>
    </div>

    <div class="decoration">
      <img src="~assets/images/news/hero_dec.svg" alt="" />
    </div>
  </section>
</template>

<script>
import NewsCard from '~/components/landing/news/NewsCard'

export default {
  components: {
    NewsCard
  },
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    news: null
  }),
  async mounted() {
    try {
      let response = await this.$axios.$get(
        `/articles?_limit=3&_sort=published_at:DESC&_where[_or][0][special]=false&_where[_or][1][special_null]=true`
      )

      this.news = response
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.latest-news {
  position: relative;

  .decoration {
    width: 180px;
    height: auto;
    position: absolute;

    left: -60px;
    top: 38px;

    img {
      width: 100%;
      height: auto;
    }

    @media screen and (max-width: 1390px) {
      display: none;
    }
  }

  .container {
    position: relative;
    z-index: 5;
  }
}
</style>
