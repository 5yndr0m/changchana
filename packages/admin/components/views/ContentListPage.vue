<template>
  <div v-if="columns">
    <Loading :loading="loading" />
    <template v-if="rows !== null && count !== null">
      <Header
        :title="title || 'Content'"
        :count="count"
        :unit="unit"
        :create="create"
        :exportCSV="exportCSV"
      />
      <template v-if="count > 0">
        <Table
          :columns="columns"
          :rows="rows"
          @delete="remove"
          @changeSort="(newSort) => setSort(newSort, true)"
          :actions="actions"
          :sort="sort"
        />
        <Pagination
          :count="count"
          :activePage="page"
          @changePage="changePage"
        />
      </template>
      <template v-else>
        <EmptyState />
      </template>
    </template>
    <Loading :loading="true" :float="false" v-else />
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: null,
    },
    contentType: {
      type: [String, Object],
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      default: "",
    },
    actions: {
      type: Object,
      default: () => ({
        edit: true,
        view: false,
        remove: true,
      }),
    },
    create: {
      type: Boolean,
      default: true,
    },
    defaultSort: {
      type: Object,
      default: null,
    },
    exportCSV: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      rows: null,
      count: null,
      sort: this.defaultSort
        ? this.defaultSort
        : {
            key: "published_at",
            direction: "DESC",
          },
    };
  },
  computed: {
    page() {
      return this.$store.state.page;
    },
    _currentSort() {
      return this.$store.state.sort;
    },
    _currentLocale() {
      return this.$store.state.currentLocale;
    },
  },
  watch: {
    _currentLocale(newVal) {
      this.loading = true;

      setTimeout(() => {
        this.fetchData();
        this.loading = false;
      }, 1500);
    },
  },
  methods: {
    async fetchData() {
      let { rows, count } = await this.__fetchContentType(this.contentType, {
        sort: this.sort,
        page: 1,
      });
      this.rows = rows;
      this.count = count;
    },
    async changePage(i, sort) {
      const _sort = sort || this.sort;
      const data = await this.__changePage(i, this.contentType, _sort);
      this.rows = data;
    },
    async remove(id) {
      this.loading = true;

      try {
        let { count } = await this.__deleteContentType(this.contentType, id);
        await this.changePage(this.page);
        this.count = count;

        setTimeout(() => {
          this.loading = false;
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    },
    async setSort(sort, isFetch) {
      if (isFetch) {
        await this.changePage(1, sort);
      }

      this.$store.commit("SET_BY_KEY", {
        key: "sort",
        value: sort,
      });

      this.sort = sort;
    },
    async setFilter(filters) {
      this.$store.commit("SET_BY_KEY", {
        key: "filters",
        value: filters,
      });
    },
    async init() {
      let options = {};
      const previousContext = this.$nuxt.context.from;

      if (previousContext && previousContext.params.id) {
        const currentSort = this._currentSort || this.sort;
        options = { page: this.page, sort: currentSort };
        this.sort = currentSort;
      } else {
        options = { page: 1, sort: this.sort };
        this.setSort(this.sort, false);
      }

      const { rows, count } = await this.__fetchContentType(
        this.contentType,
        options
      );
      this.rows = rows;
      this.count = count;
    },
  },
  async mounted() {
    this.init();
  },
};
</script>
