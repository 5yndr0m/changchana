const qs = require('qs')

module.exports = {
  async fetch(contentType, { sort, page, perPage }) {
    ////////////////////////////////////////////////
    // Check if contentType is object or not
    // eg. { path: 'users', query: 'role=1' }
    // eg. 'users'
    ////////////////////////////////////////////////
    
    // Temporary fix for content type without locale
    let type = this.$route.params.type
    const config = this.$store.state.configs[type]

    // Current locale for internationalize 🌏
    const currentLocale = this.$store.state.currentLocale

    // If contentType is object then get the path if not then use itself as value
    const contentTypeVal =
      typeof contentType === 'object' ? contentType.path : contentType

    // If contentType is object then get the query if not then pass empty string instead
    const extraQuery = typeof contentType === 'object' ? contentType.query : ''

    // Get perPage variable from the global store
    const _perPage = perPage ? perPage : this.$store.state.perPage

    // Calculate new pointer for pagination
    const currentPage = page ? page : this.$store.state.currentPage
    const pointer = parseInt(_perPage) * (parseInt(currentPage) - 1)

    // Form a queryString using qs
    // If there is sort data provided we'll use it if not return published_at:DESC
    const queryString = qs.stringify({
      _start: pointer > 0 ? pointer : undefined,
      _limit: _perPage,
      _publicationState: 'preview',
      // Internationalize 🌏
      ...(currentLocale && !config.noLocalization ? { _locale: currentLocale } : {}),
      ...(sort
        ? { _sort: `${sort.key}:${sort.direction}` }
        : { _sort: 'published_at:DESC' }),
    })

    // Query data
    const data = await this.$axios.$get(
      `/${contentTypeVal}?${queryString}&${extraQuery}`
    )

    // Query count of that contentType
    const count = await this.$axios.$get(
      `/${contentTypeVal}/count?${queryString}&${extraQuery}`
    )

    this.$store.commit('SET_BY_KEY', {
      key: 'page',
      value: page,
    })

    return {
      rows: data,
      count: count,
    }
  },
  async save(contentType, id, data) {
    let contentTypeVal =
      typeof contentType === 'object' ? contentType.path : contentType
    try {
      let response = await this.$axios.$put(`/${contentTypeVal}/${id}`, data)
      // console.log(response)
      return response
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async create(contentType, data) {
    // Temporary fix for content type without locale
    let type = this.$route.params.type
    let config = this.$store.state.configs[type]

    let contentTypeVal =
      typeof contentType === 'object' ? contentType.path : contentType

    // Current locale for internationalize 🌏
    let currentLocale = this.$store.state.currentLocale

    try {
      let response = await this.$axios.$post(`/${contentTypeVal}`, {
        ...data,
        // Internationalize 🌏
        ...(currentLocale && !config.noLocalization ? { locale: currentLocale } : {})
      })
      // console.log(response)
      return response
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  async destroy(contentType, id) {
    let contentTypeVal =
      typeof contentType === 'object' ? contentType.path : contentType
    let extraQuery = typeof contentType === 'object' ? contentType.query : ''
    
    try {
      let response = await this.$axios.$delete(`/${contentTypeVal}/${id}`)
      let count = await this.$axios.$get(
        `/${contentTypeVal}/count?${extraQuery}`
      )
      // console.log(response)
      return {
        response,
        count
      }
    } catch (err) {
      throw err
    }
  },
  async changePage(i, contentType, sort) {
    ////////////////////////////////////////////////
    // Check if contentType is object or not
    // eg. { path: 'users', query: 'role=1' }
    // eg. 'users'
    ////////////////////////////////////////////////

    // Temporary fix for content type without locale
    let type = this.$route.params.type
    const config = this.$store.state.configs[type]

    // Current locale for internationalize 🌏
    const currentLocale = this.$store.state.currentLocale

    // If contentType is object then get the path if not then use itself as value
    const contentTypeVal =
      typeof contentType === 'object' ? contentType.path : contentType

    // If contentType is object then get the query if not then pass empty string instead
    const extraQuery = typeof contentType === 'object' ? contentType.query : ''

    // Get perPage variable from the global store
    const perPage = this.$store.state.perPage

    // Calculate new pointer for pagination
    const pointer = parseInt(perPage) * (parseInt(i) - 1)

    // Form a queryString using qs
    // If there is sort data provided we'll use it if not return published_at:DESC
    const queryString = qs.stringify({
      _start: pointer,
      _limit: perPage,
      _publicationState: 'preview',
      // Internationalize 🌏
      ...(currentLocale && !config.noLocalization ? { _locale: currentLocale } : {}),
      ...(sort
        ? { _sort: `${sort.key}:${sort.direction}` }
        : { _sort: 'published_at:DESC' }),
    })

    // Fetch data
    const data = await this.$axios.$get(
      `/${contentTypeVal}?${queryString}&${extraQuery}`
    )

    this.$store.commit('SET_BY_KEY', {
      key: 'page',
      value: i,
    })

    return data
  },
}
