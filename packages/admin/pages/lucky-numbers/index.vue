<template>
  <div>
    <template v-if="!noLocalization">
      <GlobalSettings
        @changeLocale="value => __changeLocale(value)"
        v-if="!singleton"
      />
    </template>

    <ContentListPage
      :columns="columns"
      :contentType="contentType"
      :title="title"
      :unit="unit"
      :defaultSort="defaultSort"
      :exportCSV="exportCSV"
      v-if="!singleton"
      :create="create"
    />
    <ContentEditPage
      :fields="fields"
      :sidebarFields="sidebarFields"
      :title="editTitle"
      :contentType="contentType"
      singleton
      :noLocalization="noLocalization"
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
    let configs = store.state.configs['lucky-numbers']

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
        exportCSV,
        create,
        noLocalization,
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
        exportCSV,
        create: create === undefined ? true : create,
        ...(noLocalization
          ? { noLocalization: true }
          : { noLocalization: false }),
      }
    } else {
      error({ statusCode: 404 })
    }
  },
}
</script>
