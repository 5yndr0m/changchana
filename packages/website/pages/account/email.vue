<template>
  <div>
    <AccountSettings>
      <template v-slot:desktop>
        <TextHeading title="Email" class="_mgbt-32px" />
        <form @submit.prevent="update">
          <div class="_mgbt-24px">
            <label for="email">Email Address</label>
            <input
              name="email"
              type="email"
              v-model="formData.email"
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary _w-100pct">
            <span class="spinner-border spinner-border-sm" role="status" v-if="loading"></span>
            <span>Save</span>
          </button>
        </form>
      </template>

      <template v-slot:mobile>
        <TextHeading title="Email" class="_mgbt-32px" />
        <form @submit.prevent="update">
          <div class="_mgbt-24px">
            <label for="email">Email Address</label>
            <input
              name="email"
              type="email"
              v-model="formData.email"
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary _w-100pct">
            <span class="spinner-border spinner-border-sm" role="status" v-if="loading"></span>
            <span>Save</span>
          </button>
        </form>
      </template>
    </AccountSettings>
  </div>
</template>

<script>
export default {
	head() {
		return {
			title: 'Account Settings'
		}
	},
  async asyncData ({ store }) {
    let { email } = store.state.auth.user

    return {
      formData: {
        email: email ? email : '',
      }
    }
  },
  middleware: 'auth',
  layout: 'w_nav',
  data: () => ({
    loading: false
  }),
  methods: {
    async update () {
      this.loading = true
      
      try {
        let data = this.formData
        let response = await this.__updateUser(data)
         this.$swal(
          "Information Updated",
          "Successfully updating your new information",
          "success"
        );
        this.loading = false
      } catch (err) {
        this.$swal(
          "Update Failed",
          "Fail to update your new information",
          "error"
        );
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
