<template>
  <div>
    <TextHeading title="Set New Password" class="_mgbt-24px" />
    <div class="_mgbt-24px">
      <label for="password">Password</label>
      <PasswordInput class="_mgt-8px" v-model="password" />
    </div>

    <div class="_mgbt-24px">
      <label for="confirm-password">Confirm Password</label>
      <PasswordInput class="_mgt-8px" v-model="confirmPassword" />
    </div>

    <div
      class="alert alert-warning _dp-f _alit-ct _mgv-24px"
      role="alert"
      v-if="isError"
    >
      <div class="icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div>
        <strong>Please recheck password</strong><br />
        <div v-if="this.password !== this.confirmPassword">
          &#8226; Password and confirm password is not the same
        </div>
      </div>
    </div>

    <button
      @click="submitForm"
      class="_w-100pct btn btn-primary"
      :disabled="
        password.length === 0 || confirmPassword.length === 0 || isError
      "
    >
      Confirm
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    password: "",
    confirmPassword: "",
  }),
  computed: {
    isError() {
      if (
        (this.password.length > 0 || this.confirmPassword.length > 0) &&
        this.password !== this.confirmPassword
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    submitForm() {
      this.$emit("submit", {
        password: this.password,
        passwordConfirmation: this.confirmPassword,
      });
    },
  },
};
</script>
