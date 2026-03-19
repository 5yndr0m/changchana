import Vue from 'vue'

const readingTime = require('reading-time')

Vue.mixin({
  methods: {
    async __updateUser(data) {
      let user = this.$store.state.auth.user
      let token = this.$auth.strategy.token.get()

      try {
        let response = await this.$axios.$put(`/users/${user.id}`, data, {
          headers: {
            Authorization: `${token}`
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
              Authorization: `${token}`
            }
          }
        )
        this.activeComponent += 1
        this.success = true

        await this.$auth.fetchUser()
        // this.__toastAlert('success', {
        //   title: 'Update Successfully',
        //   description: 'Successfully updating your new profile image'
        // })
        this.__showToast({
          title: 'Update Successfully',
          description: 'Successfully updating your new profile image',
          type: 'primary'
        })
        this.profileImageLoading = false
      } catch (err) {
        console.log(err)
        // this.__toastAlert('error', {
        //   title: 'Update Failed',
        //   description: 'Fail to update your new profile image.'
        // })
        this.__showToast({
          title: 'Update Failed',
          description: 'Fail to update your new profile image',
          type: 'danger'
        })
        this.profileImageLoading = false
        // this.$refs.errorAlert.toast()
      }
    },
    __showToast({ title = '', description = '', type = 'primary' }) {
      let toastContainer = document.getElementById('toastContainer')

      if (!toastContainer) {
        console.log('no toastContainer')
        toastContainer = document.createElement('div')
        toastContainer.className = `toast-container`
        toastContainer.id = 'toastContainer'
        document.body.appendChild(toastContainer)
      }

      let newToastDiv = document.createElement('div')
      newToastDiv.className = `toast align-items-center text-white bg-${type} border-0`
      newToastDiv.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <strong class="_dp-b">${title}</strong>
            <span>${description}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `
      toastContainer.appendChild(newToastDiv)
      let newToast = new bootstrap.Toast(newToastDiv, {
        delay: 3000,
      })
      newToast.show()
    },
    __calculateReadingTime(content) {
      const stats = readingTime(content)
      return stats ? `${Math.ceil(stats.minutes)} MINS TO READ` : ''
    },
  },
})
