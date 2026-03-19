<template>
  <div v-if="value && fieldData">
    <div class="field-group _pdh-16px">
      <div class="field-group-heading">
        <h4 v-html="label"></h4>
        <v-sl-button
          type="text"
          size="small"
          @click="$emit('add', {}, value.length)"
        >
          <i class="fas fa-plus"></i>
          <span v-html="__getTerm('add')"></span>
        </v-sl-button>
      </div>

      <div>
        <draggable :list="value" @end="() => activeCollapse = null">
          <div
            v-for="(val, i) in value"
            :key="`dynamic-field-${i}-${val.id ? val.id : 'new'}`"
            :class="{ '_mgbt-16px': i !== value.length - 1 }"
          >
            <Accordion
              :title="val.__component ? `${fieldData.fieldsType[val.__component].label} — ${val.id}` : 'New Content'"
              @remove="removeDynamicField(i)"
              :active="activeCollapse === i"
              @toggle="
                (status) => (status ? (activeCollapse = i) : (activeCollapse = null))
              "
            >
              <div class="_mgbt-16px">
                <label>Type</label>
                <multiselect
                  :value="_options.find((x) => x.value === val.__component)"
                  trackBy="value"
                  label="label"
                  placeholder="Select"
                  :options="_options"
                  :searchable="false"
                  :allowEmpty="false"
                  :showLabels="false"
                  @input="(newVal) => handleSelect(newVal, i)"
                />
              </div>

              <template v-if="val.__component">
                <template v-if="fieldData.fieldsType[val.__component]">
                  <div
                    v-for="(mainField, mf) in fieldData.fieldsType[
                      val.__component
                    ].fields"
                    :key="`dynamic-field-${i}-field-${mf}`"
                    :class="{
                      '_mgbt-16px':
                        mf !==
                        fieldData.fieldsType[val.__component].fields.length,
                    }"
                  >
                    <template v-if="!mainField.group && !mainField.repeatable">
                      <FieldGroup
                        :label="mainField.label"
                        :value="value[i][mainField.key]"
                        @input="
                          (value) =>
                            $emit('input', value, `[${i}][${mainField.key}]`)
                        "
                        :type="mainField.type"
                        :contentType="mainField.contentType"
                        :labelKey="mainField.labelKey"
                        :valueKey="mainField.valueKey"
                        :disabled="readonly ? true : mainField.disabled"
                        :options="mainField.options"
                        :switchLabel="mainField.switchLabel"
                      />
                    </template>

                    <template v-if="mainField.group">
                      <div class="field-group">
                        <div
                          v-for="(nestedField, nf) in mainField.fields"
                          :key="`field-${mf}-nested-${nf}`"
                          :class="[
                            __determineSize(mainField.size),
                            nf === mainField.fields.length - 1
                              ? ''
                              : '_mgbt-16px',
                          ]"
                        >
                          <FieldGroup
                            :label="nestedField.label"
                            :value="
                              _.get(
                                value,
                                `[${i}][${mainField.key}][${nestedField.key}]`
                              )
                            "
                            @input="
                              (value) =>
                                $emit(
                                  'input',
                                  value,
                                  `[${i}][${mainField.key}][${nestedField.key}]`
                                )
                            "
                            :type="nestedField.type"
                            :contentType="nestedField.contentType"
                            :labelKey="nestedField.labelKey"
                            :valueKey="nestedField.valueKey"
                            :disabled="readonly ? true : nestedField.disabled"
                            :options="nestedField.options"
                            :switchLabel="nestedField.switchLabel"
                          />
                        </div>
                      </div>
                    </template>

                    <template v-if="mainField.repeatable">
                      <RepeatableField
                        :value="val[mainField.key]"
                        :fieldData="mainField"
                        :readonly="readonly"
                        :label="mainField.label"
                        @input="
                          (newVal, key) =>
                            $emit(
                              'input',
                              newVal,
                              `[${i}][${mainField.key}]${key}`
                            )
                        "
                        @remove="
                          (newVal) =>
                            $emit('input', newVal, `[${i}][${mainField.key}]`)
                        "
                      />
                    </template>
                  </div>
                </template>
              </template>
            </Accordion>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import FieldGroup from '~/components/form/FieldGroup'
import RepeatableField from '~/components/form/RepeatableField'

export default {
  data: () => ({
    activeCollapse: null,
  }),
  components: {
    FieldGroup,
    RepeatableField,
  },
  props: {
    value: {
      type: [Object, Array],
      default: null,
    },
    fieldData: {
      type: Object,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    }
  },
  computed: {
    _options() {
      return Object.keys(this.fieldData.fieldsType).map((key) => ({
        value: key,
        label: this.fieldData.fieldsType[key].label,
      }))
    },
  },
  methods: {
    // addDynamicField() {
    //   let originalValue = this.value
    //   let newValue = [...originalValue, {}]
    //   console.log(newValue)
    //   this.$emit('input', newValue)
    // },
    handleSelect(newVal, index) {
      // console.log(componentKey, index)
      // let componentKey = e.target.value
      let value = this.value
      let originalData = value[index]
      let { id } = originalData
      this.$emit(
        'input',
        {
          ...(id ? { id } : {}),
          __component: newVal.value,
        },
        `[${index}]`
      )
    },
    removeDynamicField(index) {
      this.activeCollapse = null
      let value = JSON.parse(JSON.stringify(this.value))
      value.splice(index, 1)
      // console.log(value)
      this.$emit('remove', value)
    }
  },
}
</script>

<style lang="scss" scoped>
.field-group {
  overflow: visible !important;
}
</style>