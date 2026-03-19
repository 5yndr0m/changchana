const path = require('path')

// vercel

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
    title: 'Chongjaroen',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'An official website for Chongjaroen restaurant',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      // {
      //   rel: 'stylesheet',
      //   href: '/shoelace/themes/base.css'
      // }
    ],
    script: [
      {
        type: 'module',
        src: '/bootstrap.bundle.min.js',
      },
      {
        src: 'https://static.addtoany.com/menu/page.js',
        async: true,
      },
    ],
  },
  loading: '~/components/Spinner.vue',
  /*
   ** Global CSS
   */
  css: [
    '~/assets/styles/entry.scss',
    // '~/assets/styles/shoelace/themes/base.css',
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
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/device',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['vue-scrollto/nuxt', { duration: 700 }],
  ],
  auth: {
    redirect: {
      login: '/signin',
      logout: '/signin',
      callback: '/signin',
      home: '/account'
    },
    strategies: {
      local: {
        token: {
          property: 'jwt',
          global: false
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/local', method: 'post' },
          logout: false,
          // logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/users/me', method: 'get' }
        }
      }
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL,
    headers: {
      common: {
        Authentication: process.env.BASIC_AUTHORIZATION,
      },
    }
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
  env: {
    omise: {
      publicKey: process.env.OMISE_PUBLIC_KEY,
      defaultPaymentMethod: process.env.OMISE_DEFAULT_PAYMENT_METHOD,
      otherPaymentMethods: process.env.OMISE_OTHER_PAYMENT_METHOD,
    },
  },
  server: {
    port: 8080,
  },
}
