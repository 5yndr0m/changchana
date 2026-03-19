<template>
  <div>
    <ContentListPage
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
      :title="title"
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
    let { type } = params
    let configs = store.state.configs['staffs']

    if (configs) {
      let { columns, defaultSort, singleton, fields, sidebarFields, title, unit, contentType } = configs

      return {
        columns,
        defaultSort,
        singleton,
        fields,
        sidebarFields,
        contentType: contentType ? contentType : type,
        title,
        unit
      }
    } else {
      error({ statusCode: 404 })
    }
  },
}
</script>
