<template>
  <div v-if="fields && sidebarFields && initValue">
    <ContentEditPage
      :fields="fields"
      :sidebarFields="sidebarFields"
      :contentType="type"
      :initValue="initValue"
      :readonly="readonly"
      :title="editTitle"
      :noLocalization="noLocalization"
    />
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: "auth",
  async asyncData({ store, params }) {
    let type = "lucky-numbers";
    let configs = store.state.configs[type];

    let {
      fields,
      sidebarFields,
      initValue,
      readonly,
      editTitle,
      noLocalization,
    } = configs;

    const randomStr = (length) => {
      let result = "";
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    return {
      fields,
      sidebarFields,
      initValue: { ...initValue, code: randomStr(6) },
      type,
      readonly,
      editTitle,
      ...(noLocalization ? { noLocalization } : { noLocalization: false }),
    };
  },
};
</script>
