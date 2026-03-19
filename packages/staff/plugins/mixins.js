import Vue from 'vue'

Vue.mixin({
  methods: {
    async __updateUser(data) {
      let user = this.$store.state.auth.user
      let token = this.$auth.strategy.token.get()

      try {
        let response = await this.$axios.$put(`/users/${user.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        await this.$auth.fetchUser()
        return response
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async __toastAlert(type, data) {
      switch (type) {
        case 'error':
          console.log('Show error alert')
          this.$store.commit('SET_BY_KEY', {
            key: 'errorAlert',
            value: data
          })
          break
        case 'success':
          console.log('Show success alert')
          this.$store.commit('SET_BY_KEY', {
            key: 'successAlert',
            value: data
          })
          break
      }
    },
    __getImageURL(path) {
      return `http://localhost:1337${path}`
    },
    async __changeProfileImage(files) {
      this.profileImageLoading = true
      let submitData = new FormData()
      submitData.append('id', this.$store.state.auth.user.id)
      submitData.append('files', files[0])

      let token = this.$auth.strategy.token.get()

      try {
        let response = await this.$axios.$post(
          '/api/change-profile-image',
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        this.activeComponent += 1
        this.success = true

        await this.$auth.fetchUser()
        this.__toastAlert('success', {
          title: 'Update Successfully',
          description: 'Successfully updating your new profile image'
        })
        this.profileImageLoading = false
      } catch (err) {
        console.log(err)
        this.__toastAlert('error', {
          title: 'Update Failed',
          description: 'Fail to update your new profile image.'
        })
        this.profileImageLoading = false
        // this.$refs.errorAlert.toast()
      }
    },
    __showToast(option) {
      this.$store.commit('SET_BY_KEY', {
        key: 'toastData',
        value: option,
      })
      return
    },
  }
})
