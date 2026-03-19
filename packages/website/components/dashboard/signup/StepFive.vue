<template>
  <div>
    <form @submit.prevent="checkOTP()" v-if="data">
      <p class="_mgv-24px _tal-ct _cl-gray-700">
        <span>OTP has been sent to </span>
        <span v-html="data.phone"></span>
        <span v-if="!countdown" class="resend" @click="requestOTP"
          >, <b>Resend</b></span
        >
        <vue-countdown
          v-if="countdown"
          :time="5000"
          @end="countdown = false"
          v-slot="{ totalSeconds }"
          >, Resend ({{ totalSeconds }})</vue-countdown
        >
      </p>
      <v-otp-input
        class="otp-input-wrapper _mgbt-48px"
        ref="otpInput"
        input-classes="otp-input"
        separator=""
        :num-inputs="6"
        :should-auto-focus="true"
        :is-input-num="true"
        @on-change="handleOnChange"
      />

      <button
        type="submit"
        class="_w-100pct btn btn-primary"
        :disabled="token.length < 6"
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          v-if="loading"
        ></span>
        <span v-else>Next</span>
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
    countdown: true,
    token: "",
    code: "",
    loading: false,
  }),
  methods: {
    handleOnChange(value) {
      this.code = value;
    },
    async checkOTP() {
      if (this.code.length === 6) {
        try {
          this.$nuxt.$loading.start();
          await this.$axios.$post(
            "/api/otp/verify",
            {
              code: this.code,
              token: this.token,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          this.$emit("submit", {});
          this.$nuxt.$loading.finish();
        } catch (err) {
          this.$nuxt.$loading.finish();
          let message = "Please recheck your phone number";

          if (err.response && err.response.data) {
            message = err.response.data.message ?? err.message;
          }
          this.__showToast({
            title: "Request OTP Failed",
            description: message,
            type: "danger",
          });
        }
      } else {
        this.$nuxt.$loading.finish();
        this.__showToast({
          title: "Incorrect OTP",
          description: "Please recheck your otp token",
          type: "danger",
        });
      }
    },
    async requestOTP() {
      try {
        let response = await this.$axios.$post(
          "/api/otp/request",
          {
            recipient: `66${this.data.phone.slice(1)}`,
          },
        );

        this.countdown = true;
        this.token = response.data.token;
      } catch (err) {
        this.loading = false;
        let message = "Please recheck your phone number";
        if (err.response && err.response.data) {
          message = err.response.data.message ?? err.message;
        }
        this.__showToast({
          title: "Request OTP Failed",
          description: message,
          type: "danger",
        });
      }
    },
    focusInput() {
      try {
        this.$refs.otpInput.$children[0].focus = true;
      } catch (error) {}
    }
  },
  mounted() {
    if (this.data) {
      if (this.data.phone) {
        if (this.data.phone.length === 10) {
          this.focusInput();
          this.requestOTP();
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.resend {
  cursor: pointer;

  b {
    color: #1797ad;
    font-weight: bold;
  }
}
</style>
