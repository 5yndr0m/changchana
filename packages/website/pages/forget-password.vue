<template>
  <div>
    <!-- Desktop -->
    <CardLayout
      maxWidth="420"
      :left="{
        text: 'Home',
        icon: 'chevron-left',
        callback: () => $router.push('/signin'),
      }"
    >
      <template v-slot:desktop>
        <Enquiry
          v-show="isShowEnquiryForm"
          :mobile.sync="mobile"
          @submit="enquiry"
        />

        <VerifyOTP
          v-show="!isShowEnquiryForm && isShowVerifyOTPForm"
          :mobile="mobile"
          :refno="refno"
          :otpCountdown.sync="otpCountdown"
          @resendOTP="enquiry"
          @submit="verifyOTP"
        />

        <ResetPassword
          v-show="isShowResetPasswordForm"
          @submit="resetPassword"
        />

        <Complete v-show="isShowComplete" />
      </template>
      <template v-slot:mobile>
        <Enquiry
          v-show="isShowEnquiryForm"
          :mobile.sync="mobile"
          @submit="enquiry"
        />

        <VerifyOTP
          v-show="!isShowEnquiryForm && isShowVerifyOTPForm"
          :mobile="mobile"
          :refno="refno"
          :otpCountdown.sync="otpCountdown"
          @resendOTP="enquiry"
          @submit="verifyOTP"
        />

        <ResetPassword
          v-show="isShowResetPasswordForm"
          @submit="resetPassword"
        />

        <Complete v-show="isShowComplete" />
      </template>
    </CardLayout>
  </div>
</template>

<script>
import Enquiry from "~/components/ForgetPassword/Enquiry";
import VerifyOTP from "~/components/ForgetPassword/VerifyOTP";
import ResetPassword from "~/components/ForgetPassword/ResetPassword";
import Complete from "~/components/ForgetPassword/Complete";
export default {
  head() {
    return {
      title: "ลืมรหัสผ่าน",
    };
  },
  layout: "wo_nav",
  components: {
    Enquiry,
    VerifyOTP,
    ResetPassword,
    Complete,
  },
  data: () => ({
    mobile: "",
    token: null,
    refno: null,
    forgetPasswordToken: null,
    loading: false,
    otpCountdown: false,
    stepEnabled: "enquiry",
  }),
  computed: {
    isShowEnquiryForm() {
      return this.stepEnabled === "enquiry";
    },
    isShowVerifyOTPForm() {
      return this.stepEnabled === "verify";
    },
    isShowResetPasswordForm() {
      return this.stepEnabled === "resetpassword";
    },
    isShowComplete() {
      return this.stepEnabled === "complete";
    },
  },
  methods: {
    async enquiry() {
      this.loading = true;
      try {
        this.$nuxt.$loading.start();
        const resp = await this.$axios.$post("/api/forget-password", {
          mobile: this.mobile,
        });
        this.loading = false;
        this.$nuxt.$loading.finish();

        if (resp.data) {
          this.token = resp.data.token;
          this.refno = resp.data.refno;
          this.otpCountdown = true;
          this.stepEnabled = "verify";
        }
      } catch (err) {
        this.$nuxt.$loading.finish();
        let message = "Please recheck your mobile";
        if (err.response && err.response.data) {
          message = err.response.data.message ?? err.message;
        }

        this.__showToast({
          title: "Reset Password Failed",
          description: message,
          type: "danger",
        });
        this.loading = false;
      }
    },
    async verifyOTP(payloads) {
      try {
        this.$nuxt.$loading.start();
        const resp = await this.$axios.$post(
          "/api/otp-verify-forget-password",
          {
            token: this.token,
            code: payloads.code,
          }
        );
        this.loading = false;
        this.$nuxt.$loading.finish();

        if (resp.data) {
          this.forgetPasswordToken = resp.data.code;
          this.stepEnabled = "resetpassword";
        }
      } catch (err) {
        this.$nuxt.$loading.finish();
        let message = "Please recheck your mobile";
        if (err.response && err.response.data) {
          message = err.response.data.message ?? err.message;
        }

        this.__showToast({
          title: "Reset Password Failed",
          description: message,
          type: "danger",
        });
        this.loading = false;
      }
    },
    async resetPassword(payloads) {
      try {
        this.$nuxt.$loading.start();
        const resp = await this.$axios.$post("/auth/reset-password", {
          ...payloads,
          code: this.forgetPasswordToken,
        });
        this.loading = false;
        this.$nuxt.$loading.finish();

        if (resp.jwt) {
          this.stepEnabled = "complete";
        }
      } catch (err) {
        this.$nuxt.$loading.finish();
        let message = "Error somthing wrong";
        if (err.response && err.response.data) {
          message = err.response.data.message ?? err.message;
        }

        this.__showToast({
          title: "Reset Password Failed",
          description: message,
          type: "danger",
        });
        this.loading = false;
      }
    },
  },
};
</script>
