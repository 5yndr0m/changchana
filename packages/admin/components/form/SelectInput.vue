<template>
  <div>
    <label for="" v-html="label"></label>
    <OtterSelect
      :options="options"
      :value="option"
      :disabled="disabled"
      @ot-input="newData => (option = newData)"
      :placeholder="placeholder"
    />
    <!-- <multiselect
      :value="options.find((x) => x.value === value)"
      trackBy="value"
      label="label"
      placeholder="Select"
      :options="options"
      :searchable="false"
      :allowEmpty="allowEmpty"
      :showLabels="false"
      @input="(value, id) => $emit('input', value ? value.value : value)"
    /> -->
  </div>
</template>

<script>
import OtterSelect from '~/components/OtterSelect'

export default {
  components: {
    OtterSelect,
  },
  props: {
    label: String,
    value: [String, Number],
    options: {
      type: Array,
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    allowEmpty: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "Select",
    },
  },
  data() {
    return {
      option: this.options.find(x => x.value === this.value),
    }
  },
  watch: {
    option(newVal) {
      this.$emit('input', newVal && newVal.value)
    },
    options(newVal) {
      if (!newVal || newVal.length === 0) {
        this.option = undefined;
      }
    }
  },
}
</script>
