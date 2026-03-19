<template>
  <div>
    <AccountSettings>
      <template v-slot:desktop>
        <TextHeading title="Mobile Number" class="_mgbt-32px" />
        <template v-if="!requested">
          <form @submit.prevent="requestOTP">
            <div class="_mgbt-24px">
              <label for="phone">Mobile Number</label>
              <input
                name="phone"
                type="tel"
                v-model="formData.phone"
                class="form-control"
              />
            </div>

            <button class="btn btn-primary _w-100pct" type="submit">
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                v-if="loading"
              ></span>
              <span v-else>Save</span>
            </button>
          </form>
        </template>
        <template v-else>
          <p class="_mgbt-24px _tal-ct _cl-gray-600">
            <span>OTP has been sent to </span>
            <span v-html="formData.phone"></span>
            <span v-if="!countdown" class="resend" @click="resendVerify()"
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
          <form @submit.prevent="verifyOTP">
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
              class="btn btn-primary _w-100pct"
              type="submit"
              :disabled="token.length < 6"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                v-if="loading"
              ></span>
              <span>Save</span>
            </button>
          </form>
        </template>
      </template>

      <template v-slot:mobile>
        <TextHeading title="Mobile Number" class="_mgbt-32px" />
        <template v-if="!requested">
          <form @submit.prevent="requestOTP">
            <div class="_mgbt-24px">
              <label for="phone">Mobile Number</label>
              <input
                name="phone"
                type="tel"
                v-model="formData.phone"
                class="form-control"
              />
            </div>

            <button class="btn btn-primary _w-100pct" type="submit">
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                v-if="loading"
              ></span>
              <span v-else>Save</span>
            </button>
          </form>
        </template>
        <template v-else>
          <p class="_mgbt-24px _tal-ct _cl-gray-600">
            <span>OTP has been sent to </span>
            <span v-html="formData.phone"></span>
            <span v-if="!countdown" class="resend" @click="resendVerify()"
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
          <form @submit.prevent="verifyOTP">
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
              class="btn btn-primary _w-100pct"
              type="submit"
              :disabled="token.length < 6"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                v-if="loading"
              ></span>
              <span>Save</span>
            </button>
          </form>
        </template>
      </template>
    </AccountSettings>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Account Settings",
    };
  },
  async asyncData({ store }) {
    let { phone } = store.state.auth.user;

    return {
      formData: {
        phone: phone ? phone : "",
      },
    };
  },
  middleware: "auth",
  layout: "w_nav",
  data: () => ({
    loading: false,
    requested: false,
    token: "",
    countdown: false,
    code: null,
  }),
  methods: {
    async update() {
      this.loading = true;
      try {
        let data = this.formData;
        let response = await this.__updateUser(data);
        this.$swal(
          "Information Updated",
          "Successfully updating your new information",
          "success"
        );

        this.loading = false;
        this.requested = false;
      } catch (err) {
        this.$swal(
          "Update Failed",
          "Fail to update your new information",
          "error"
        );
        this.loading = false;
      }
    },
    handleOnChange(value) {
      this.code = value;
    },
    async requestOTP() {
      let user = this.$store.state.auth.user;
      let oldPhoneNumber = user.phone;

      if (this.formData.phone !== oldPhoneNumber) {
        console.log(`66${this.formData.phone.slice(1)}`);
        try {
          let response = await this.$axios.$post(
            "/api/otp/request",
            {
              recipient: `66${this.formData.phone.slice(1)}`,
            },
          );

          this.requested = true;
          this.countdown = true;
          this.verifyId = response.data.id;
          this.token = response.data.token;
        } catch (err) {
          this.$swal(
            "Request OTP Failed",
            "Please recheck your phone number222",
            "error"
          );
        }
      } else {
        this.$swal(
          "Update Failed",
          "New phone number is the same to the previous one",
          "error"
        );
      }
    },
    async verifyOTP() {
      if (this.code.length === 6) {
        try {
          let response = await this.$axios.$post(
            "/api/otp/verify",
            {
              code: this.code,
              token: this.token,
            },
          );
          this.update();
        } catch (err) {
          let message = "Please recheck your phone number";
          if (err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
          }
          this.$swal("Verify OTP Failed", message, "error");
        }
      } else {
        this.$swal(
          "Verify OTP Failed",
          "Please recheck your otp token",
          "error"
        );
      }
    },
    async resendVerify() {
      console.log("resend request otp");
      try {
        let response = await this.$axios.$post(
          "/api/otp/request",
          {
            recipient: `66${this.formData.phone.slice(1)}`,
          },
        );

        this.requested = true;
        this.countdown = true;
        this.token = response.data.token;
      } catch (err) {
        let message = "Please recheck your phone number";
        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        }
        this.$swal("Request OTP Failed", message, "error");
      }
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
