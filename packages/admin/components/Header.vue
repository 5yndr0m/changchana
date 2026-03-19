<template>
  <section class="header _mgbt-32px-md _mgbt-24px">
    <div class="_dp-f-md _alit-fe _alit-ct">
      <h1 class="_fs-4" v-html="title"></h1>
      <p
        v-if="count !== undefined && count !== null"
        v-html="`ทั้งหมด ${count} ${unit}`"
        class="_mgl-16px-md _mgt-0px-md _mgt-8px"
      ></p>
    </div>
    <div class="actions">
      <v-sl-button
        type="info"
        v-if="exportCSV"
        @click="handleExportCSV ? handleExportCSV(exportCSV.contentType): handleExport()"
        v-html="__getTerm('export-csv')"
      ></v-sl-button>
      <v-sl-button
        type="primary"
        v-if="create"
        @click="$router.push($route.path + '/create')"
        v-html="__getTerm('add')"
      ></v-sl-button>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: String,
    count: [String, Number],
    unit: String,
    create: Boolean,
    exportCSV: {
      type: Object,
      default: null,
    },
    handleExportCSV: {
      type: Function,
      default: null,
    },
  },
  methods: {
    handleExport() {
      window.open(
        `${process.env.baseURL}/api/export-csv?contentType=${this.exportCSV.contentType}`,
        "_blank"
      );
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    line-height: 1;
    margin: 0 !important;
  }
}
</style>
