<template>
  <div>
    <!-- <sl-alert type="danger" duration="3000" closable ref="errorAlert">
      <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
      <strong>Registration Failed</strong><br />
      Please recheck your information or contact our staff.
    </sl-alert> -->

    <!-- Desktop -->
    <CardLayout maxWidth="460" :left="_left">
      <template v-slot:desktop>
        <div class="signup-progress">
          <div
            class="progress-indicator"
            :style="{ width: `${((activeComponent + 1) / 5) * 100}%` }"
          ></div>
        </div>
        <TextHeading title="Sign up" class="_mgbt-24px" />
        <Component
          :is="components[activeComponent]"
          @next="(data) => goNext(data)"
          @submit="(data) => signup(data)"
          @update="(data) => updateData(data)"
          :data="formData"
        />
      </template>

      <template v-slot:mobile>
        <div class="signup-progress">
          <div
            class="progress-indicator"
            :style="{ width: `${((activeComponent + 1) / 5) * 100}%` }"
          ></div>
        </div>
        <TextHeading title="Sign up" class="_mgbt-24px" />
        <Component
          :is="components[activeComponent]"
          @next="(data) => goNext(data)"
          @submit="(data) => signup(data)"
          @update="(data) => updateData(data)"
          :data="formData"
        />
      </template>
    </CardLayout>
  </div>
</template>

<script>
import StepOne from "~/components/dashboard/signup/StepOne";
import StepTwo from "~/components/dashboard/signup/StepTwo";
import StepThree from "~/components/dashboard/signup/StepThree";
import StepFour from "~/components/dashboard/signup/StepFour";
import StepFive from "~/components/dashboard/signup/StepFive";
import UserConsent from "~/components/dashboard/signup/UserConsent";
import SuccessContent from "~/components/dashboard/SuccessContent";

export default {
  head() {
    return {
      title: "สมัครสมาชิก",
    };
  },
  middleware: "noauth",
  components: {
    StepOne,
    StepTwo,
    StepThree,
    StepFour,
    StepFive,
    UserConsent,
    SuccessContent,
  },
  layout: "wo_nav",
  data: () => ({
    activeComponent: 0,
    components: [
      "StepOne",
      "StepTwo",
      "StepThree",
      "StepFour",
      "UserConsent",
      "StepFive",
      "SuccessContent",
    ],
    formData: {},
    success: false,
  }),
  computed: {
    _left() {
      if (!this.success) {
        return {
          text: "Back",
          icon: "chevron-left",
          callback: () => this.handleBack(),
        };
      }
    },
  },
  methods: {
    updateData(data) {
      let newData = {
        ...this.formData,
        ...data,
      };
      this.formData = newData;
    },
    goNext(data) {
      let newData = {
        ...this.formData,
        ...data,
      };
      this.formData = newData;
      this.activeComponent += 1;
    },
    async signup(data) {
      let newData = {
        ...this.formData,
        ...data,
        username: this.formData.email,
      };
      let submitData = new FormData();

      for (let key in newData) {
        if (key === "birthdate")
          submitData.append(key, this.$moment(newData[key]).toISOString());
        else submitData.append(key, newData[key]);
      }
      try {
        await this.$axios.$post("/api/signup", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.goNext(data);
      } catch (err) {
        let title = "Signup failed";
        let message = err.message;

        if (err.response && err.response.data && err.response.data.message) {
          message = err.response.data.message;
        }

        this.__showToast({
          title,
          description: message,
          type: "danger",
        });

        this.activeComponent += 1;
        this.success = true;
      }
    },
    handleBack() {
      if (this.activeComponent > 0) {
        this.activeComponent -= 1;
        return;
      } else if (this.activeComponent === 0) {
        this.$router.push("/signin");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";
</style>
