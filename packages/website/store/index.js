export const state = () => ({
  errorAlert: null,
  successAlert: null
})

export const mutations = {
  SET_BY_KEY (state, { key, value }) {
    state[key] = value
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { $axios }) {
    let response = await $axios.$get('/api/init')
    let { settings } = response
    commit('SET_BY_KEY', {
      key: 'settings',
      value: settings
    })
    
    let branches = await $axios.$get('/branches')
    commit('SET_BY_KEY', {
      key: 'branches',
      value: branches.map( branch => ({
        id: branch.id,
        name: branch.name,
        image: branch.cover_image?.url || '',
      }))
    })

  }
}
