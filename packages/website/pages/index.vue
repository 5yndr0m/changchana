<template>
  <div>
    <Hero :data="pageData.hero" />
    <AppFeatures :data="pageData.features" />
    <Blessings :data="pageData.blessings" />
    <LatestNews class="_mgbt-64px-md _mgbt-48px" :data="pageData.news" />
    <CallToAction />
  </div>
</template>

<script>
import Hero from '~/components/landing/home/Hero'
import AppFeatures from '~/components/landing/home/AppFeatures'
import Blessings from '~/components/landing/home/Blessings'
import LatestNews from '~/components/landing/home/LatestNews'

export default {
  layout: 'main',
  components: {
    Hero,
    AppFeatures,
    Blessings,
    LatestNews,
	},
	head() {
		return {
			title: 'หน้าแรก'
		}
	},
  async asyncData({ $axios }) {
    let response = await $axios.$get(`/home-page`)

    return {
      pageData: response
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
