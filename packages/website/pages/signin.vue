<template>
  <div>
    <!-- Desktop -->
    <CardLayout
      maxWidth="460"
      :left="{
        text: 'Home',
        icon: 'chevron-left',
        callback: () => $router.push('/'),
      }"
    >
      <template v-slot:desktop>
        <TextHeading title="Sign in" class="_mgbt-24px" />
        <form @submit.prevent="signin">
          <div class="_mgbt-24px">
            <label for="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              class="form-control"
              placeholder="Enter your email or mobile"
              v-model="formData.identifier"
            />
          </div>
          <div class="_mgbt-24px">
            <label for="password">Password</label>
            <PasswordInput
              v-model="formData.password"
              placeholder="Enter your password"
            />
          </div>
          <button
            submit
            class="_w-100pct _dp-b _mgt-24px btn btn-primary"
            :loading="loading"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
            ></span>
            <span v-else>Sign in</span>
          </button>
        </form>
        <nuxt-link to="/forget-password" class="_dp-b _tal-ct _mgt-24px"
          >Forget Password</nuxt-link
        >
      </template>

      <template v-slot:desktop-footer>
        <div class="_tal-ct _mgt-32px">
          <p class="_cl-white">
            สมาชิกใหม่? <nuxt-link to="/signup">ลงทะเบียน</nuxt-link> ที่นี่
          </p>
        </div>
      </template>

      <template v-slot:mobile>
        <TextHeading title="Sign in" class="_mgbt-24px" />
        <form @submit.prevent="signin">
          <div class="_mgbt-24px">
            <label for="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              class="form-control"
              placeholder="Enter your email or mobile"
              v-model="formData.identifier"
            />
          </div>
          <div class="_mgbt-24px">
            <label for="password">Password</label>
            <PasswordInput v-model="formData.password" />
          </div>
          <button
            submit
            class="_w-100pct _dp-b _mgt-24px btn btn-primary"
            :loading="loading"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              v-if="loading"
            ></span>
            <span v-else>Sign in</span>
          </button>
        </form>
        <nuxt-link to="/forget-password" class="_dp-b _tal-ct _mgt-24px"
          >Forget Password</nuxt-link
        >
        <div class="_tal-ct _mgt-32px">
          <p>
            สมาชิกใหม่? <nuxt-link to="/signup">ลงทะเบียน</nuxt-link> ที่นี่
          </p>
        </div>
      </template>
    </CardLayout>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "เข้าสู่ระบบ",
    };
  },
  layout: "wo_nav",
  data: () => ({
    loading: false,
    formData: {
      identifier: "",
      password: "",
    },
  }),
  methods: {
    async signin(e) {
      e.preventDefault();
      this.loading = true;
      let redirect = this.$route.query.redirect;

      try {
        const oldRedirect = this.$auth.options.redirect;
        this.$auth.options.redirect = false;
        await this.$auth.loginWith("local", {
          data: this.formData,
        });
        this.$auth.options.rewriteRedirects = oldRedirect;

        this.__showToast({
          title: "Signin Successfully",
          description: "Successfully signing you in",
          type: "primary",
        });
        this.loading = false;

        if (redirect) {
          setTimeout(() => this.$router.push(`/${redirect}`), 1000);
        } else {
          setTimeout(() => this.$router.push("/account"), 1000);
        }
      } catch (err) {
        this.__showToast({
          title: "Signin Failed",
          description: "Please recheck your username or password",
          type: "danger",
        });
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

input {
  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #adb5bd;
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #adb5bd;
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #adb5bd;
  }
}
</style>
