<template>
  <div v-if="options">
    <label for="" v-html="label"></label>
    <OtterSelect
      search
      :options="options"
      :value="option"
      @ot-input="newData => option = newData"
      @search="handleSearch"
    />
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
      :showLabels="false"
      :disabled="disabled"
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
    contentType: String,
    label: String,
    value: [String, Number, Object],
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
  methods: {
    async handleSearch(query) {
      let data = await this.$axios.$get(
        `/${this.contentType}?_limit=10&${this.labelKey}_contains=${query}${this._currentLocale ? `&_locale=${this._currentLocale}` : ''}`
      )

      this.options = [
        ...data.map(val => ({
          label: val[this.labelKey],
          value: val[this.valueKey],
        })),
      ]
    },
  },
  watch: {
    option(newVal) {
      // This will trigger on page load
      if (newVal) {
        this.$emit('input', newVal.value)
      }
    },
  },
  computed: {
    // For internalization
    _currentLocale() {
      return this.$store.state.currentLocale
    },
    _option() {
      if (this.value) {
        if (Object.keys(this.value).length > 2) {
          return {
            label: this.value[this.labelKey],
            value: this.value[this.valueKey],
          }
        } else {
          return this.value
        }
      } else {
        return null
      }
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
      `/${this.contentType}?_limit=10&${
        this.value ? `${this.valueKey}_ne=${this.value[this.valueKey]}` : ''
      }${this._currentLocale ? `&_locale=${this._currentLocale}` : ''}`
    )
    // let data = await this.$axios.$get(
    //   `/${this.contentType}?_limit=10&${this.valueKey}_ne=${
    //     this.value ? this.value[this.valueKey] : ''
    //   }`
    // )

    // Assign options data to options variable, also include the selected value to the option in order to make it show the label
    this.options = [
      // ...(this.value
      //   ? [
      //       {
      //         label: this.value[this.labelKey],
      //         value: this.value[this.valueKey],
      //       },
      //     ]
      //   : []),
      ...data.map(val => ({
        label: val[this.labelKey],
        value: val[this.valueKey],
      })),
    ]

    this.option = this.value
      ? {
        label: this.value[this.labelKey],
        value: this.value[this.valueKey]
      }
      : null
  },
}
</script>
