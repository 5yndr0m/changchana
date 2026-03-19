<template>
  <div class="field-group _pdh-16px" v-if="fieldData">
    <div class="field-group-heading">
      <h4 v-html="label"></h4>
      <v-sl-button
        type="text"
        size="small"
        @click="
          addRepeatableField(
            fieldData.initValue,
            `[${value ? value.length : 0}]`,
            fieldData.limit
          )
        "
      >
        <i class="fas fa-plus"></i>
        <span v-html="__getTerm('add')"></span>
      </v-sl-button>
    </div>
    <template v-if="value">
      <draggable :list="value" @end="() => activeCollapse = null">
        <div
          v-for="(row, r) in value"
          :key="`repeatable-field-row-${r}-${row ? row.id : 'new'}`"
          :class="[r === value.length - 1 ? '' : '_mgbt-16px']"
        >
          <Accordion
            :title="__getAccordionLabel(row, fieldData.labelKey, { prefix: fieldData.prefixLabelKey, getLabel: fieldData.getLabel })"
            :active="activeCollapse === r"
            @remove="removeRepeatable(r)"
            :readonly="fieldData.readonly"
            @toggle="
              (status) =>
                status ? (activeCollapse = r) : (activeCollapse = null)
            "
          >
            <div class="row">
              <div
                v-for="(field, f) in fieldData.fields"
                :key="`repeatable-field-row-${r}-field-${f}`"
                :class="[
                  __determineSize(field.size),
                  f === fieldData.fields.length - 1 ? '' : '_mgbt-16px',
                ]"
              >
                <FieldGroup
                  :label="field.label"
                  :value="value[r][field.key]"
                  @input="
                    (newVal) => $emit('input', newVal, `[${r}][${field.key}]`)
                  "
                  :type="field.type"
                  :contentType="field.contentType"
                  :labelKey="field.labelKey"
                  :valueKey="field.valueKey"
                  :disabled="((readonly || fieldData.readonly) && !value[r].new_item) ? true : field.disabled"
                  :options="field.options"
                  :switchLabel="field.switchLabel"
                />
              </div>
            </div>
          </Accordion>
        </div>
      </draggable>
    </template>
  </div>
</template>

<script>
import FieldGroup from '~/components/form/FieldGroup'

export default {
  data: () => ({
    activeCollapse: null,
  }),
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
      default: 'Repeatable',
    },
  },
  components: {
    FieldGroup,
  },
  methods: {
    addRepeatableField(initValue, key, limit) {
      if (limit) {
        if (this.value) {
          if (this.value.length < limit) {
            this.$emit('input', initValue, key)
          } else {
            this.__showToast({
              type: 'danger',
              title: 'Limit Exceed!',
              message: 'Cannot add more entry',
            })
          }
        } else {
          this.$emit('input', initValue, key)
        }
      } else {
        this.$emit('input', initValue, key)
      }
    },
    removeRepeatable(index) {
      this.activeCollapse = null
      let value = JSON.parse(JSON.stringify(this.value))
      value.splice(index, 1)
      this.$emit('remove', value)
    },
  },
}
</script>

<style lang="scss" scoped></style>
