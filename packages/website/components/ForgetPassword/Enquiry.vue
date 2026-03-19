<template>
  <div>
    <TextHeading title="Forget Password" class="_mgbt-24px" />
    <div class="_mgbt-24px">
      <label for="email">Mobile Number (เบอร์โทรศัพท์)</label>
      <input
        name="mobile_number"
        type="number"
        class="form-control _mgt-8px"
        placeholder="Enter your mobile"
        :value="mobile"
        @input="(e) => handleInput(e, 'phone', 10)"
        @keydown="(e) => handleInput(e, 'phone', 10)"
      />
    </div>
    <button
      type="submit"
      :disabled="mobile.length !== 10"
      @click="submit"
      class="_w-100pct _dp-b _mgt-24px btn btn-primary"
    >
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        v-if="loading"
      ></span>
      <span v-else>Next</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    mobile: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    loading: false,
  }),
  methods: {
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

      this.$emit("update:mobile", value);
    },
    submit() {
      this.$emit("submit");
    }
  },
};
</script>
