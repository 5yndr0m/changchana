<template>
  <div class="wrapper-color-picker">
    <p><label for="color-picker" v-html="label"></label></p>
    <verte
      id="color-picker"
      picker="wheel"
      model="hex"
      menuPosition="top"
      :value="value"
      @input="(val) => $emit('input', val)"
    />
    <span class="color-label">{{ value }}</span>
  </div>
</template>

<script>
import TextInput from "~/components/form/TextInput";
export default {
  components: {
    TextInput,
  },
  props: {
    value: {
      type: String,
      default: "#000000",
    },
    label: String,
  },
};
</script>

<style lang="scss">
.wrapper-color-picker #color-picker {
  display: inline;
  vertical-align: -5px;
}
.wrapper-color-picker #color-picker > button {
  border: 1px solid #000000;
  border-radius: 100px;
  display: inline;
}
.wrapper-color-picker .color-label {
  display: inline;
  margin-left: 5px;
}
</style>
