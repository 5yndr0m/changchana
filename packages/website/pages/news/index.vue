<template>
  <div>
    <section class="hero _pdbt-64px-md _pdbt-32px">
      <div class="container _mgbt-64px-md _mgbt-32px">
        <div class="_tal-l-md _tal-ct">
          <h4 class="section-hero-label" v-html="pageData.hero.label"></h4>
          <h1 class="_fs-2-md _fs-3 _mgv-24px" v-html="pageData.hero.title"></h1>
          <p v-html="pageData.hero.description">
          </p>
        </div>
      </div>

      <div class="container _pdh-16px-md _pdh-0px" v-if="highlight">
        <div class="featured-card-wrapper">
          <FeaturedCard
            :title="highlight.title"
            :excerpt="highlight.excerpt"
            :image="highlight.cover_image ? highlight.cover_image.url : ''"
            :special="highlight.special"
            :to="`/news/${highlight.slug}`"
          />

          <div class="decoration">
            <img src="~assets/images/news/hero_dec.svg" alt="" />
          </div>
        </div>
      </div>
    </section>

    <section class="contents _pdt-8px">
      <div class="container">
        <div class="row">
          <div
            class="col-md-4 _mgbt-32px"
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

        <div class="_dp-f _jtfct-ct" v-if="pageCount > 1">
          <sliding-pagination
            :current="currentPage"
            :total="pageCount"
            @page-change="changePage"
            :class="{ '-w-pagination': pageCount >= 10 }"
          ></sliding-pagination>
        </div>
      </div>
    </section>

    <CallToAction class="_mgt-64px-md _mgt-48px" />
  </div>
</template>

<script>
import FeaturedCard from '~/components/landing/news/FeaturedCard'
import NewsCard from '~/components/landing/news/NewsCard'

export default {
	head() {
		return {
			title: 'ข่าวสาร & โปรโมชั่น'
		}
	},
  async asyncData({ $axios }) {
    let perPage = 6
    let currentPage = 1
    let pageData = await $axios.$get(`/news-page`)
    let response = await $axios.$get(
      `/articles?_limit=${perPage}&_start=1&_sort=published_at:DESC&_where[_or][0][special]=false&_where[_or][1][special_null]=true`
    )

    let highlight = await $axios.$get(
      `/articles?_limit=1&_start=0&_sort=published_at:DESC&_where[_or][0][special]=false&_where[_or][1][special_null]=true`
    )

    let count = await $axios.$get('/articles/count?_where[_or][0][special]=false&_where[_or][1][special_null]=true')
    let pageCount = Math.ceil((count - 1) / perPage)

    return {
      pageData,
      news: response,
      count,
      perPage,
      currentPage,
      pageCount,
      highlight: highlight.length ? highlight[0] : null
    }
  },
  layout: 'main',
  components: {
    FeaturedCard,
    NewsCard
  },
  methods: {
    async changePage(page) {
      this.currentPage = page
      let startAt = page === 1 ? 1 : (page - 1) * this.perPage + 1

      try {
        let response = await this.$axios.$get(
          `/articles?_limit=${this.perPage}&_start=${startAt}&_sort=published_at:DESC&_where[_or][0][special]=false&_where[_or][1][special_null]=true`
        )

        this.news = response
      } catch (err) {
        console.log(err)
      }
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

  @media screen and (max-width: $md) {
    padding-top: 104px;
  }

  .featured-card-wrapper {
    position: relative;

    .decoration {
      width: 180px;
      height: auto;
      position: absolute;
      top: -30px;
      right: -60px;

      @media screen and (max-width: $md) {
        display: none;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
