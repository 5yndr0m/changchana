<template>
  <div v-if="columns">
    <Loading :loading="loading" />
    <template v-if="rows !== null && count !== null">
      <Header title="Event/Concert" :count="count" create unit="รายการ" />
      <div class="tools-filters _mgbt-24px _pdh-0px-md _pdh-4px">
        <div class="-left" v-if="optionsData.branches">
          <div class="branches">
            <SelectInput label="สาขา" :options="optionsData.branches" :value="branch"
              @input="(value) => onChangeData('branch', value)" allowEmpty />
          </div>
          <div class="btn-apply" v-if="inputChangeCount > 0">
            <v-sl-button type="primary" @click="fetchData()" v-html="__getTerm('search')"></v-sl-button>
          </div>
        </div>
      </div>
      <template v-if="rows.length">
        <Table :columns="columns" :rows="rows" @changeSort="(newSort) => (sort = newSort)" :actions="actions" :sort="sort">
          <template #head>
            <th>สร้างเมื่อ</th>
            <th width="30" class="action"></th>
          </template>
          <template #content="{ row }">
            <td>
              {{ $moment(row.created_at).local().format("DD/MM/YYYY HH:mm")}}
            </td>
            <td>
              <nuxt-link class="link-w-icon" :to="`events/zones/${row.id}`">
                <i class="fas fa-sitemap" :title="__getTerm('edit-zone')"></i>
              </nuxt-link>
            </td>
          </template>
        </Table>
      </template>
      <EmptyState label="Event/Concert" v-else />
      <Pagination :count="count" :activePage="page" @changePage="changePage" v-if="rows.length" />
    </template>
    <Loading :loading="true" :float="false" v-else />
  </div>
</template>

<script>
import SelectInput from "~/components/form/SelectInput";
export default {
  components: {
    SelectInput,
  },
  layout: "admin",
  middleware: "auth",
  async asyncData({ store, error }) {
    const configs = store.state.configs["events"];

    if (configs) {
      const { columns, defaultSort, title } = configs;

      return {
        columns,
        defaultSort,
        title,
        actions: {
          edit: true,
          view: false,
          remove: false,
        },
      };
    } else {
      error({ statusCode: 404 });
    }
  },
  data: () => {
    return {
      loading: false,
      rows: null,
      count: null,
      page: 1,
      inputChangeCount: 0,
      sort: {
        key: "id",
        direction: "DESC",
      },
      optionsData: {
        branches: [],
      },
      branch: null,
    };
  },
  async mounted() {
    this.fetchData();

    const branches = await this.$axios.$get(`/branches?_limit=-1`);
    this.optionsData["branches"] = [
      {
        label: "All",
        value: null,
      },
      ...branches.map((val) => ({
        label: val["name"],
        value: val["id"],
      })),
    ];
  },
  watch: {
    async sort(newVal) {
      this.page = 1;
      await this.changePage(this.page, newVal);
    },
  },
  methods: {
    getQueryString(limit = undefined) {
      return this.$qs.stringify({
        ...(this.branch ? { branch: this.branch } : {}),
        _limit: limit,
      });
    },
    async fetchData() {
      this.loading = true;
      const query = this.getQueryString();
      const { rows, count } = await this.__fetchContentType(
        {
          path: "events",
          query,
        },
        { sort: this.sort, page: 1 }
      );
      this.rows = rows;
      this.count = count;
      this.page = 1;
      this.loading = false;
      this.inputChangeCount = 0;
    },
    async changePage(page) {
      this.loading = true;
      const query = this.getQueryString();

      const data = await this.__changePage(
        page,
        {
          path: "events",
          query,
        },
        this.sort
      );
      this.page = page;
      this.rows = data;
      this.loading = false;
    },
    async onChangeData(type, newValue) {
      if (type === "branch") {
        this.branch = newValue;
      }
      this.inputChangeCount++;
    },
    create() { }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.tools-filters {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.-left {
  display: flex;
  align-items: center;
  margin-left: -4px;
  margin-right: -4px;

  @media screen and (max-width: $md) {
    display: block;
  }

  >div {
    margin-left: 4px;
    margin-right: 4px;

    &.branches {
      min-width: 240px;
    }

    &.btn-apply {
      margin-top: 28px;
    }

    @media screen and (max-width: $md) {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      margin-bottom: 12px;

      &:last-of-type {
        margin-bottom: 0;
      }

      &.branches {
        min-width: none;
      }

      &.status {
        min-width: none;
      }

      .btn-apply {
        margin-top: 0;
      }
    }
  }
}

.link-w-icon {
  color: #11545E;
}
</style>
