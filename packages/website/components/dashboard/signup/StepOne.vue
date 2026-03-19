<template>
  <div>
    <form @submit.prevent="checkPassword()" v-if="data">
      <div class="_mgbt-24px">
        <label for="email">E-mail</label>
        <input
          name="email"
          type="email"
          :value="data.email"
          required
          @input="(e) => (formData['email'] = e.target.value)"
          class="form-control"
        />
      </div>

      <div class="_mgbt-24px">
        <label for="email">Confirm E-mail</label>
        <input
          name="confirm-email"
          type="email"
          v-model="confirmEmail"
          class="form-control"
        />
      </div>

      <div class="_mgbt-24px">
        <label for="password">Password</label>
        <PasswordInput v-model="formData.password" />
        <!-- <input
          name="password"
          type="password"
          required
          @input="(e) => (formData['password'] = e.target.value)"
          class="form-control"
        /> -->
      </div>

      <div class="_mgbt-24px">
        <label for="confirm-password">Confirm Password</label>
        <PasswordInput v-model="confirmPassword" />
        <!-- <input
          name="confirm-password"
          type="password"
          required
          @input="(e) => (confirmPassword = e.target.value)"
          class="form-control"
        /> -->
      </div>

      <div
        class="alert alert-warning _dp-f _alit-ct _mgv-24px"
        role="alert"
        v-if="_error"
      >
        <div class="icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div>
          <strong>Please recheck email/password</strong><br />
          <div v-if="this.formData.email !== this.confirmEmail">&#8226; E-mail and confirm email is not the same</div>
          <div v-if="this.formData.password !== this.confirmPassword">&#8226; Password and confirm password is not the same</div>
        </div>
      </div>

      <button
        type="submit"
        class="_w-100pct btn btn-primary"
        :disabled="
          formData.password.length === 0 ||
          confirmPassword.length === 0 ||
          _error
        "
      >
        Next
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    formData: {
      email: "",
      password: "",
    },
    confirmPassword: "",
    confirmEmail: "",
  }),
  computed: {
    _error() {
      if (
        (this.formData.password.length > 0 ||
          this.confirmPassword.length > 0) &&
        this.formData.password !== this.confirmPassword ||
        this.formData.email !== this.confirmEmail
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.$emit("update", this.formData);
      },
    },
  },
  methods: {
    checkPassword() {
      if (this.formData.password === this.confirmPassword)
        this.$emit("next", this.formData);
    },
  },
  mounted() {
    if (this.data) {
      this.formData.email = this.data.email ? this.data.email : "";
      this.formData.password = this.data.password ? this.data.password : "";
    }
  },
};
</script>