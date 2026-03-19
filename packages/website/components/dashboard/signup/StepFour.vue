<template>
  <div>
    <form @submit.prevent="checkUser()">
      <div class="_mgbt-24px">
        <label for="mobile_number">Mobile Number (เบอร์โทรศัพท์)</label>
        <input
          name="mobile_number"
          type="number"
          class="form-control"
          :value="formData.phone"
          @input="(e) => handleInput(e, 'phone', 10)"
          @keydown="(e) => handleInput(e, 'phone', 10)"
        />
      </div>

      <BirthdateInput v-model="formData.birthdate" />

      <div
        class="alert alert-warning _dp-f _alit-ct _mgv-24px"
        role="alert"
        v-if="_error"
      >
        <div class="icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div>
          <strong v-html="_error.title">Please recheck infomation</strong><br />
          <span v-html="_error.message"
            >Error message</span
          >
        </div>
      </div>

      <button
        type="submit"
        class="_w-100pct btn btn-primary _mgt-8px"
        :disabled="_error === null || typeof _error === 'object'"
      >
        Next
      </button>
    </form>
  </div>
</template>

<script>
import BirthdateInput from "~/components/BirthdateInput";
import moment from "moment";
export default {
  components: {
    BirthdateInput,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => {
    return {
    formData: {
      phone: "",
      birthdate: null,
    },
  };
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.$emit("update", this.formData);
      },
    },
  },
  computed: {
    _error() {
      if (this.formData.phone.length < 10) {
        if (this.formData.phone.length > 0) {
          return {
            title: "Please re-check your information",
            message: "Please recheck your phone number.",
          };
        } else {
          return null;
        }
      } else if (!moment(this.formData.birthdate).isValid()) {
        return {
          title: "Please re-check your information",
          message: "Please recheck your birthdate",
        };
      } else {
        return false;
      }
    },
  },
  methods: {
    async checkUser() {
      try {
        this.$nuxt.$loading.start();
        await this.$axios.$post(
          `/api/check-user`,
          {
            phone: this.formData.phone,
            email: this.data.email,
          },
        );
        this.$emit("next", this.formData);
        this.$nuxt.$loading.finish();
      } catch (err) {
        this.$nuxt.$loading.finish();
        let title = "User Exists!";
        let message = "User with this email or phone is already exist";
        if(err.response && err.response.data && err.response.data.message) {
          title = "Error check user";
          message = err.response.data.message;
        }
        this.__showToast({
          title,
          description: message,
          type: "danger",
        });
      }
    },
    handleInput(e, key, limit) {
      const value = e.target.value;

      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
      ) {
        if (value.length >= limit) {
          e.preventDefault();
        }
      }

      this.formData[key] = value;
    },
  },
  mounted() {
    if (this.data) {
      if (this.data.phone) this.formData.phone = this.data.phone;
      if (this.data.birthdate) this.formData.birthdate = this.data.birthdate;
    }
  },
};
</script>

<style lang="scss" scoped>
.birthdate-input {
  background-color: #fff !important;
}
</style>
