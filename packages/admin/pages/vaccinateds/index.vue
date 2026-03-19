<template>
  <div>
    <ContentListPage
      :create="create"
      :columns="columns"
      :contentType="contentType"
      :title="title"
      :unit="unit"
      :defaultSort="defaultSort"
      v-if="!singleton"
    />
    <ContentEditPage
      :fields="fields"
      :sidebarFields="sidebarFields"
      :title="editTitle"
      :contentType="contentType"
      singleton
      v-else
    />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  async asyncData({ store, params, redirect, error }) {
    let type = 'vaccinateds'
    let configs = store.state.configs[type]

    if (configs) {
      let {
        columns,
        defaultSort,
        singleton,
        fields,
        sidebarFields,
        title,
        unit,
        contentType,
        editTitle,
        create,
      } = configs

      return {
        columns,
        defaultSort,
        singleton,
        fields,
        sidebarFields,
        contentType: contentType ? contentType : type,
        title,
        unit,
        editTitle,
        create,
      }
    } else {
      error({ statusCode: 404 })
    }
  },
}
</script>
