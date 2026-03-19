<template>
  <div>
    <TextHeading title="Forget Password" class="_mgbt-24px" />
    <p class="_mgv-24px text-center">
      <span class="text-center" v-html="getMobileLabel()"></span>
      <span v-if="!otpCountdown" class="resend" @click="requestOTP"
        >, <b>Resend</b></span
      >
      <vue-countdown
        v-if="otpCountdown"
        :time="30000"
        @end="endCountdown()"
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
      @click="verifyOTP"
      class="_w-100pct btn btn-primary"
      :disabled="code.length < 6"
    >
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        v-if="loading"
      ></span>
      <span v-else>Verify OTP</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    otpCountdown: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      default: "",
    },
    refno: {
      type: String,
      default: "",
    }
  },
  data: () => ({
    loading: false,
    code: "",
  }),
  methods: {
    getMobileLabel() {
      return `OTP has been sent to <br /> ${this.mobile} (Ref: ${this.refno})`
    },
    handleOnChange(value) {
      this.code = value;
    },
    requestOTP() {
      this.$emit("resendOTP");
    },
    endCountdown() {
      this.$emit("update:otpCountdown", false);
    },
    verifyOTP() {
      this.$emit("submit", {
        code: this.code,
      });
    },
    focusInput() {
      try {
        this.$refs.otpInput.$children[0].focus = true;
      } catch (error) {}
    },
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
