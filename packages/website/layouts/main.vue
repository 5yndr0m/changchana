<template>
  <div class="landing-layout">
    <!-- <sl-alert type="danger" duration="3000" closable ref="errorAlert">
      <template v-if="__errorAlert">
        <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
        <strong v-html="__errorAlert.title"></strong><br />
        <span v-html="__errorAlert.description"></span>
      </template>
    </sl-alert>

    <sl-alert type="success" duration="3000" closable ref="successAlert">
      <template v-if="__successAlert">
        <sl-icon slot="icon" name="check2-circle"></sl-icon>
        <strong v-html="__successAlert.title"></strong><br />
        <span v-html="__successAlert.description"></span>
      </template>
    </sl-alert> -->

    <Navigation />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Navigation from '~/components/landing/MainNavigation'
import Footer from '~/components/AppFooter'

export default {
  name: "mainlayout",
  components: {
    Navigation,
    Footer,
  },
  // computed: {
  //   __errorAlert() {
  //     return this.$store.state.errorAlert
  //   },
  //   __successAlert() {
  //     return this.$store.state.successAlert
  //   },
  // },
  // watch: {
  //   __errorAlert(newVal) {
  //     if (newVal) this.$refs.errorAlert.toast()
  //   },
  //   __successAlert(newVal) {
  //     if (newVal) this.$refs.successAlert.toast()
  //   },
  // },
  head() {
    let seoData = this.$store.state.settings.seo
    let title = seoData.title || ''
    let description = seoData.description || ''
    // let keywords = seoData.keywords || ''

    let image
    if (seoData.image) image = seoData.image.url
    else image = ''

    return {
      script: [
        {
          src: '/bootstrap.bundle.min.js',
        },
      ],
      
      bodyAttrs: {
        class: '-landing-layout',
      },
      titleTemplate: `%s - ${title}`,
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
}
</script>

<style lang="scss" scoped>
.landing-layout {
  &:deep() {
    @import '~assets/styles/landing.scss';
  }
}
</style>
