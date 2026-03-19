module.exports = {
  changeLocale(newLocale) {
    this.$store.commit('CHANGE_LOCALE', newLocale)
    this.$router.push({
      path: this.$route.path,
      query: {
        locale: newLocale
      }
    })
    // // this.$nuxt.refresh()
    // setTimeout(() => window.location.reload(), 200)
  }
}