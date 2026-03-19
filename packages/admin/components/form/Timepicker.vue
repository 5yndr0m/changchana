<template>
  <div>
    <label for="" v-html="label"></label>
    <v-date-picker
      class="inline-block h-full"
      v-model="date"
      mode="time"
      is24hr
      :attributes="attrs"
    >
      <template v-slot="{ inputValue, togglePopover }">
        <div class="datepicker">
          <div class="datepicker-icon"></div>
          <input
            class="form-input"
            @click="togglePopover"
            readonly
            placeholder="Select"
            :value="inputValue"
            :disabled="disabled"
          />
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    value: [String, Date],
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    date: null,
    attrs: [
      {
        key: "today",
        dot: true,
        dates: new Date(),
      },
    ],
  }),
  watch: {
    date(newVal) {
      this.$emit(
        "input",
        newVal ? this.$moment(newVal).format("HH:mm:ss.SSS") : null
      );
    },
    value(newVal) {
      this.date = (newVal && this.$moment(newVal, "HH:mm:ss.SSS").format("YYYY-MM-DDTHH:mm:ss.SSS")) ?? null;
    },
  },
  mounted() {
    // console.log('mounted', this.value)
    this.date = (this.value && this.$moment(this.value, "HH:mm:ss.SSS").format("YYYY-MM-DDTHH:mm:ss.SSS")) ?? null;
  },
};
</script>

<style lang="scss" scoped>
  .vc-container .vc-time-picker .vc-date {
    display: none;
  }
</style>
