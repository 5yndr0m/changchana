const path = require('path')

export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Chongjaroen Staff',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Chongjaroen Staff',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //   rel: 'stylesheet',
      //   href: '/shoelace/themes/base.css'
      // }
    ],
    script: [
      {
        type: 'module',
        src: '/shoelace/shoelace.js',
      },
      {
        src: '/html5-qrcode.min.js'
      }
    ],
  },
  loading: '~/components/Spinner.vue',
  /*
   ** Global CSS
   */
  css: [
    '~/assets/styles/entry.scss',
    '~/assets/styles/shoelace/themes/base.css',
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {
      mode: 'client',
      src: '~/plugins/client.js',
    },
    '~/plugins/mixins.js',
    '~/plugins/ssr.js',
    // '~/plugins/shoelace.js'
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,
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
  ],
  auth: {
    redirect: {
      login: '/signin',
      logout: '/signin',
      callback: '/signin',
      home: '/account',
    },
    strategies: {
      local: {
        token: {
          property: 'jwt',
        },
        endpoints: {
          login: {
            url: 'api/staff/signin',
            method: 'post',
            propertyName: 'jwt',
          },
          user: {
            url: 'users/me',
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
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.NUXT_ENV_BASE_URL || 'http://localhost:7000'
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
  server: {
    port: 3000,
  },
}
