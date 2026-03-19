export const state = () => ({
  errorAlert: null,
  successAlert: null,
  scannerData: null,
  pointsData: null,
  toastData: null,
})

export const mutations = {
  SET_BY_KEY (state, { key, value }) {
    state[key] = value
  }
}

export const actions = {}
