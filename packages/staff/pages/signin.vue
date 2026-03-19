<template>
  <div>
    <AppHeader />
    <div class="container _pdt-32px">
      <TextHeading title="Sign in" class="_mgbt-24px" />
      <sl-form @sl-submit="signin">
        <sl-input
          name="email"
          type="text"
          label="Email"
          @sl-input="(e) => (formData['identifier'] = e.target.value)"
          class="_mgbt-24px"
        ></sl-input>
        <sl-input
          name="password"
          type="password"
          label="Password"
          @sl-input="(e) => (formData['password'] = e.target.value)"
        ></sl-input>
        <sl-button
          type="primary"
          submit
          class="_w-100pct _dp-b _mgt-24px"
          :loading="loading"
          >Sign in</sl-button
        >
      </sl-form>
      <!-- <nuxt-link to="/forget-password" class="_dp-b _tal-ct _mgt-24px"
        >Forget Password</nuxt-link
      > -->
    </div>
  </div>
</template>

<script>
export default {
  layout: 'wo_nav',
  data: () => ({
    loading: false,
    formData: {
      identifier: '',
      password: '',
    },
  }),
  methods: {
    async signin(e) {
      // console.log(e)
      e.preventDefault()
      this.loading = true

      let data = this.formData
      console.log(data)
      try {
        await this.$auth.loginWith('local', {
          data: this.formData,
        })
        // this.$refs.successAlert.toast()
        this.__toastAlert('success', {
          title: 'Signin Successfully',
          description: 'Successfully signing you in',
        })
        this.loading = false
        setTimeout(() => this.$router.push('/account'), 2500)
      } catch (err) {
        console.log(err)
        this.__toastAlert('error', {
          title: 'Signin Failed',
          description: 'Please recheck your email or password.',
        })
        this.loading = false
      }
      // console.log(this.formData)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';
</style>
