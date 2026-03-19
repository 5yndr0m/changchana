import logger from 'connect-logger'

export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Chongjaroen CMS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'An official CMS for Chongjaroen Website',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&display=swap',
      },
      // {
      //   rel: 'stylesheet',
      //   href: '/shoelace/themes/base.css'
      // }
    ],
  },
  loading: '~/components/Spinner.vue',
  /*
   ** Global CSS
   */
  css: ['~/assets/styles/entry.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/node_modules/@shoelace-style/shoelace/dist/shoelace.js', mode: 'client' },
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/client.js', mode: 'client' },
    '~/plugins/mixins.js',
    '~/plugins/ssr.js',
    '~/plugins/wallet-service.js',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/moment'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'vue-sweetalert2/nuxt',
  ],
  /*
   ** Sweetalert2 configuration
   */
  sweetalert: {
    confirmButtonColor: '#1a7a89',
    cancelButtonColor: '#52525b'
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:7001'
  },
  env: {
    baseURL: process.env.BASE_URL
  },
  auth: {
    redirect: {
      login: '/signin',
      logout: '/signin',
      callback: '/signin',
      home: '/',
    },
    strategies: {
      local: {
        token: {
          property: 'jwt',
        },
        endpoints: {
          login: {
            url: '/api/staff/signin',
            method: 'post',
            propertyName: 'jwt',
          },
          user: {
            url: '/users/me',
            method: 'get',
            // no propertyName: false here. Moved to specific user field below
          },
          logout: false,
        },
        user: {
          property: false,
        },
      },
    },
  },
  server: {
    // host: '0.0.0.0',
    port: 4040,
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  vue: {
    config: {
      ignoredElements: [/sl-*/],
    },
  },
  router: {
    middleware: ['locale'],
  },
  serverMiddleware: [
    logger({ format: '%date %status %method %url (%time)' })
  ],
}
