<template>
  <div>
    <div class="_mgbt-24px text-center">
      <h4 class="_cl-gray-700">Please recheck you information</h4>
    </div>
    <form @submit.prevent="$emit('next', formData)">
      <div class="_pdl-6px _pdr-6px">
        <div class="row _mgbt-24px">
          <div class="col-3 _mgbt-8px _cl-gray-700">E-mail</div>
          <div class="col-9 _mgbt-8px">{{ data.email }}</div>
          <div class="col-3 _mgbt-8px _cl-gray-700">Name</div>
          <div class="col-9 _mgbt-8px">
            {{ data.first_name }} {{ data.last_name }}
          </div>
          <div class="col-3 _mgbt-8px _cl-gray-700">Nickname</div>
          <div class="col-9 _mgbt-8px">{{ data.nickname }}</div>
          <div class="col-3 _mgbt-8px _cl-gray-700">Gender</div>
          <div class="col-9 _mgbt-8px">{{ data.gender }}</div>
          <div class="col-3 _mgbt-8px _cl-gray-700">Mobile</div>
          <div class="col-9 _mgbt-8px">{{ data.phone }}</div>
          <div class="col-3 _mgbt-8px _cl-gray-700">Birthday</div>
          <div class="col-9 _mgbt-8px">{{ data.birthdate }}</div>
          <div class="col-12 checkbox _mgt-24px term_condition">
            <input
              type="checkbox"
              id="acceptConsent"
              v-model="formData.acceptConsent"
            />
            <label for="acceptConsent">I agree to the Groovejaroen</label>
            <span class="link" @click="showTermAndCondition()"
              >Privacy Policy and Terms and Conditions</span
            >
          </div>
        </div>
      </div>
      <button
        type="submit"
        class="_w-100pct btn btn-primary"
        :disabled="!formData.acceptConsent"
      >
        Next
      </button>
    </form>
    <Modal
      v-show="isModalVisible"
      @close="closeModal"
      v-bind:message="termAndCondition"
      v-bind:title="'Privacy Policy and Terms and Conditions'"
    />
  </div>
</template>

<script>
import Modal from "~/components/Modal";
export default {
  components: {
    Modal,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    formData: {
      acceptConsent: false,
    },
    termAndCondition: "",
    isModalVisible: false,
  }),
  methods: {
    async showTermAndCondition() {
      if (this.termAndCondition === "") {
        this.$nuxt.$loading.start();
        try {
          let response = await this.$axios.$get("/terms-and-conditions");
          this.$nuxt.$loading.finish();
          if (response.content && response.content.length) {
            response.content.forEach((row) => {
              this.termAndCondition += `<div class='_mgbt-16px term-item'><h4>${row.title}</h4>${row.description}</div>`;
            });
            this.isModalVisible = true;
          }
        } catch (err) {
          this.__showToast({
            title: "Fetch terms & conditions error",
            description: err.message,
            type: "danger",
          });
          this.$nuxt.$loading.finish();
          this.isModalVisible = false;
        }
      } else {
        this.isModalVisible = true;
      }
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style lang="scss">
.link {
  color: #1797ad;
  cursor: pointer;
  font-weight: normal;
  &:hover {
    text-decoration: underline;
  }
}
.checkbox {
  font-size: 15px;
  & label {
    font-weight: normal;
    display: inline;
    padding-left: 5px;
  }
}
.term-item {
  & ol,
  ul {
    padding: 0 15px;
  }
}
</style>
