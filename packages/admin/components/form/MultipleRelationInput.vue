<template>
  <div v-if="options">
    <label for="" v-html="label"></label>
    <OtterMultiSelect :options="options" v-model="option" @search="handleSearch" />
    <!-- <multiselect
      v-model="option"
      trackBy="value"
      label="label"
      placeholder="Select"
      :options="options"
      :searchable="true"
      :internalSearch="false"
      @search-change="handleSearch"
      :allowEmpty="true"
      multiple
      :disabled="disabled"
    /> -->
  </div>
</template>

<script>
import OtterMultiSelect from '~/components/OtterMultiSelect'

export default {
  components: {
    OtterMultiSelect
  },
  props: {
    contentType: String,
    label: String,
    value: [String, Number, Array],
    labelKey: String,
    valueKey: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: null,
      option: null,
    }
  },
  computed: {
    // For internalization
    _currentLocale() {
      return this.$store.state.currentLocale
    },
  },
  methods: {
    async handleSearch(query) {
      let data = await this.$axios.$get(
        `/${this.contentType}?_limit=10&${this.labelKey}_contains=${query}${this._currentLocale ? `&_locale=${this._currentLocale}` : ''}`
      )

      this.options = [
        ...data.map((val) => ({
          label: val[this.labelKey],
          value: val[this.valueKey],
        })),
      ]
    },
  },
  watch: {
    option(newVal) {
      // This will trigger on page load
      this.$emit(
        'input',
        newVal.map((val) => val.value)
      )
    },
  },
  async mounted() {
    ///////////////////////////////////////////////////////////////////////
    // valueKey ↴
    // Object key which we will use to get a value from value object
    // labelKey ↴
    // Object key which we will use to get a label from value object
    ///////////////////////////////////////////////////////////////////////

    // Getting data with the contentType got from props
    // If value is not NULL then add _ne to the query in order to prevent data duplication
    let data = await this.$axios.$get(
      `/${this.contentType}?_limit=10${
        this.value
          ? this.value
              .map(
                (val, i) =>
                  `&_where[${i}][${this.valueKey}_ne]=${val[this.valueKey]}`
              )
              .join('')
          : ''
      }`
    )

    // Assign options data to options variable, also include the selected value to the option in order to make it show the label
    this.options = [
      // ...(this.value
      //   ? this.value.map((val) => ({
      //       label: val[this.labelKey],
      //       value: val[this.valueKey],
      //     }))
      //   : []),
      ...data.map((val) => ({
        label: val[this.labelKey],
        value: val[this.valueKey],
      })),
    ]

    this.option = this.value
      ? this.value.map((val) => ({
          label: val[this.labelKey],
          value: val[this.valueKey],
        }))
      : this.value
  },
}
</script>
