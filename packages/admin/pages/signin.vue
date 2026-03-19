<template>
  <div class="wrapper _pdh-24px">
    <div class="card-container">
      <sl-card class="_w-100pct">
        <div class="branding _mgt-12px _mgbt-24px">
          <img src="~assets/images/logo.svg" alt="" />
        </div>
        <sl-form @sl-submit="signin">
          <div class="_mgbt-16px">
            <label for="">Email</label>
            <sl-input
              :value="formData.identifier"
              @sl-input="(e) => (formData.identifier = e.target.value)"
              type="email"
            />
          </div>

          <div class="_mgbt-24px">
            <label for="">Password</label>
            <sl-input
              :value="formData.password"
              @sl-input="(e) => (formData.password = e.target.value)"
              type="password"
            />
          </div>

          <v-sl-button
            class="_w-100pct"
            type="primary"
            :loading="loading"
            submit
            >Sign in</v-sl-button
          >
        </sl-form>
      </sl-card>
      <p class="_tal-ct _fs-7 _mgt-16px signin-footer">Content Management System for <a :href="_brandURL ? _brandURL : '#'" target="_blank" rel="noopener noreferrer">{{ _brandname }}</a> Website</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'signin',
  asyncData({ store, redirect }) {
    if (store.$auth.loggedIn) redirect('/dashboard')
  },
  data: () => ({
    formData: {
      identifier: '',
      password: '',
    },
    loading: false,
  }),
  computed: {
    _brandname() {
      return this.$store.state.brandname
    },
    _brandURL() {
      return this.$store.state.brandURL
    }
  },
  methods: {
    async signin(e) {
      this.loading = true
      // console.log(e)

      try {
        await this.$auth.loginWith('local', {
          data: this.formData,
        })

        // this.$toasted.show('Signin Successfully')
        // this.__showToast({
        //   title: 'Signin Successfully',
        //   description: 'Redirecting you to admin panel',
        //   status: 'success',
        // })
        this.__showToast({
          type: 'success',
          title: 'Signin Successfully',
          message: 'Redirecting you to admin panel',
        })
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
        this.__showToast({
          type: 'danger',
          title: 'There is something wrong',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F7FAFC;

  .card-container {
    width: 100%;
    max-width: 370px;
  }
}

.branding {
  width: 100px;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;

  img {
    width: 100%;
    height: auto;
  }
}

.signin-footer {
  a {
    color: $primary-color;
  }
}
</style>
