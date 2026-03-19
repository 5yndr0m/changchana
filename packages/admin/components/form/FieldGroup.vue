<template>
  <div v-if="type">
    <TextInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'text'"
    />
    <SelectInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'select'"
    />
    <WysiwygInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'wysiwyg'"
    />
    <FileUpload
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'fileUpload'"
    />
    <MultipleFileUpload
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'multipleFileUpload'"
    />
    <TextAreaInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'textarea'"
    />
    <NumberInput
      v-bind="$attrs"
      @input="(value) => $emit('input', parseInt(value))"
      v-if="type === 'number'"
    />
    <RelationInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'relation'"
    />
    <MultipleRelationInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'multipleRelation'"
    />
    <PasswordInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'password'"
    />
    <SwitchInput
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'switch'"
    />
    <Datepicker
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'datepicker'"
    />
    <Datetimepicker
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'datetimePicker'"
    />
    <Timepicker
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'timepicker'"
    />
    <QRCode
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'qrCode'"
    />

    <ColorPicker
      v-bind="$attrs"
      @input="(value) => $emit('input', value)"
      v-if="type === 'colorPicker'"
    />
  </div>
</template>

<script>
import TextInput from "~/components/form/TextInput";
import TextAreaInput from "~/components/form/TextAreaInput";
import SelectInput from "~/components/form/SelectInput";
import WysiwygInput from "~/components/form/WysiwygInput";
import FileUpload from "~/components/form/FileUpload";
import MultipleFileUpload from "~/components/form/MultipleFileUpload";
import NumberInput from "~/components/form/NumberInput";
import RelationInput from "~/components/form/RelationInput";
import MultipleRelationInput from "~/components/form/MultipleRelationInput";
import PasswordInput from "~/components/form/PasswordInput";
import SwitchInput from "~/components/form/SwitchInput";
import Datepicker from "~/components/form/Datepicker";
import Datetimepicker from "~/components/form/Datetimepicker";
import Timepicker from "~/components/form/Timepicker";
import QRCode from "~/components/form/QRCode";
import ColorPicker from "~/components/form/ColorPicker";

export default {
  props: {
    type: String,
  },
  components: {
    ColorPicker,
    TextInput,
    SelectInput,
    WysiwygInput,
    FileUpload,
    MultipleFileUpload,
    TextAreaInput,
    NumberInput,
    RelationInput,
    PasswordInput,
    SwitchInput,
    MultipleRelationInput,
    Datepicker,
    Datetimepicker,
    Timepicker,
    QRCode,
  },
  mounted() {
    // console.log(this.$attrs)
  },
};
</script>
