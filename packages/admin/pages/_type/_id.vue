<template>
  <div v-if="fields && sidebarFields && initValue">
    <ContentEditPage
      :fields="fields"
      :sidebarFields="sidebarFields"
      :contentType="type"
      :initValue="initValue"
      :readonly="readonly"
      :disableDelete="disableDelete"
      :title="editTitle"
      :noLocalization="noLocalization"
      :linkBack="linkBack"
    />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  async asyncData({ store, params }) {
    let { type } = params
    let configs = store.state.configs[type]
    let { fields, sidebarFields, initValue, readonly, disableDelete, editTitle, noLocalization, linkBack } = configs

    return {
      fields,
      sidebarFields,
      initValue,
      type,
      readonly,
      disableDelete,
      editTitle,
      linkBack,
      ...(noLocalization ? { noLocalization } : { noLocalization: false })
    }
  },
}
</script>
