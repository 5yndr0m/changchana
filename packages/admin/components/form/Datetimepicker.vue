<template>
  <div>
    <label for="" v-html="label"></label>
    <v-date-picker
      class="inline-block h-full"
      mode="dateTime"
      v-model="date"
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
        key: 'today',
        dot: true,
        dates: new Date(),
      },
    ],
  }),
  watch: {
    date(newVal) {
      // console.log(newVal)
      this.$emit('input', this.$moment(newVal).format('YYYY-MM-DD'))
    },
  },
  mounted() {
    this.date = this.value
  },
}
</script>

<style lang="scss" scoped>
</style>
