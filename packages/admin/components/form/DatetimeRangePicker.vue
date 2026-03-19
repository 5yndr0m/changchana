<template>
  <div>
    <label for="" v-html="label"></label>
    <v-date-picker
      class="inline-block h-full wrapper-date-range"
      mode="dateTime"
      v-model="dates"
      is-range
      is24hr
      :max-date='maxDate'
    >
      <template v-slot="{ togglePopover }">
        <div class="datepicker">
          <div class="fas fa-calendar-alt mr-2"></div>
          <input
            class="form-input"
            @click="togglePopover"
            v-model="dateStartText"
          />
          <span class="mr-2">-</span>
          <input
            class="form-input"
            @click="togglePopover"
            v-model="dateEndText"
          />
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    value: [Object],
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    maxDate: {
      type: Date,
      default: null,
    }
  },
  data: () => ({
    dates: {},
  }),
  computed: {
    dateStartText() {
      return this.$moment(this.dates.start).format("DD/MM/YYYY HH:mm");
    },
    dateEndText() {
      return this.$moment(this.dates.end).format("DD/MM/YYYY  HH:mm");
    },
  },
  mounted() {
    this.dates = this.value;
  },
  watch: {
    dates(newVal) {
      this.$emit("input", {
        start: this.$moment(newVal.start).format("YYYY-MM-DD HH:mm"),
        end: this.$moment(newVal.end).format("YYYY-MM-DD HH:mm"),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-date-range {
  background: #fff !important;
  min-height: 40px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #d9e5ef;
  box-sizing: border-box;
  display: block;
  border-radius: 5px;

  & .datepicker {
    display: inline-flex;

    & .form-input {
      border: none;
      background-color: transparent;
      width: 125px;

      &:focus {
        border: none;
      }
    }
  }
}
</style>
