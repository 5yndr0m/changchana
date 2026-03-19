<template>
  <div>
    <label for="" v-html="label"></label>
    <v-date-picker
      class="inline-block h-full"
      v-model="date"
      :attributes="attributes"
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
    attributes: {
      type: Array,
      default() {
        return [
          {
            key: "today",
            dot: true,
            dates: new Date(),
          },
        ];
      },
    },
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    date: null,
  }),
  watch: {
    date(newVal) {
      this.$emit(
        "input",
        newVal ? this.$moment(newVal).format("YYYY-MM-DD") : null
      );
    },
    value(newVal) {
      this.date = newVal;
    },
  },
  mounted() {
    this.date = this.value;
  },
};
</script>

<style lang="scss" scoped>
</style>
