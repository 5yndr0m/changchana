<template>
  <div class="dashboard-layout">
    <!-- <sl-alert type="danger" duration="3000" closable ref="errorAlert">
      <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
      <strong>Signin Failed</strong><br />
      Please recheck your information or contact our staff.
    </sl-alert>

    <sl-alert type="success" duration="3000" closable ref="successAlert">
      <sl-icon slot="icon" name="check2-circle"></sl-icon>
      <strong>Signin Successfully</strong><br />
      Redirecting you to your dashboard.
    </sl-alert> -->

    <Navigation />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Navigation from '~/components/dashboard/AppNavigation'
import Footer from '~/components/AppFooter'

export default {
  name: "default",
  components: {
    Navigation,
    Footer,
  },
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
.dashboard-layout {
  &:deep() {
    @import '~assets/styles/dashboard.scss';
  }
}
</style>
