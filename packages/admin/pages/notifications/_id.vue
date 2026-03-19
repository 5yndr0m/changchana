<template>
  <div v-if="fields && sidebarFields && initValue">
    <ContentEditPage
      :fields="configFields || fields"
      :sidebarFields="configSidebarFields || sidebarFields"
      :contentType="type"
      :initValue="initValue"
      @update="(data) => (formData = { ...formData, ...data })"
      :readonly="readonly"
      :disableDelete="disableDelete"
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
    let type = "notifications";
    let configs = store.state.configs[type];

    let {
      fields,
      sidebarFields,
      initValue,
      readonly,
      disableDelete,
      editTitle,
      noLocalization,
    } = configs;

    return {
      fields,
      sidebarFields,
      initValue,
      type,
      readonly,
      disableDelete,
      editTitle,
      ...(noLocalization ? { noLocalization } : { noLocalization: false }),
    };
  },
  data: () => ({
    loading: false,
    formData: null,
    newContent: false,
    configFields: null,
    configSidebarFields: null,
    // For internalization
    translations: null,
  }),
  async mounted() {
    ////////////////////////////////////////////////////////
    // Singleton only use save and mounted function
    // Normal content type will use save, mounted, remove, create (every functions)
    ////////////////////////////////////////////////////////

    if (!this.$route.params.id) this.$router.push("/dashboard");
    if (this.$route.params.id !== "create") {
      let data = await this.$axios.$get(
        `/notifications/${this.$route.params.id}?_publicationState=preview`
      );

      if (data.published_at) {
        this.configFields = this.fields.map((f) => {
          const result = { ...f };
          if (['type', 'sending_method', 'visibility'].indexOf(f.key) >= 0) {
            result.disabled = true;
          }
          return result;
        });

        this.configSidebarFields = this.sidebarFields.map((f) => {
          const result = { ...f };
          if (["visibility"].indexOf(f.key) >= 0) {
            result.disabled = true;
          }
          return result;
        });
      }

      this.formData = {
        ...data,
        visibility: data.published_at ? "published" : "null",
      };
    } else {
      this.formData = {
        ...this.initValue,
        visibility: "published",
      };
      this.newContent = true;
    }
  },
};
</script>
