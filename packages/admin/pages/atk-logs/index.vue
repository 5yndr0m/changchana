<template>
  <div v-if="columns">
    <Loading :loading="loading" />
    <template v-if="rows !== null && count !== null">
      <Header
        title="ATK Logs"
        :count="count"
        unit="รายการ"
        :exportCSV="exportCSV"
        :handleExportCSV="handleExportCSV"
      />
      <div class="tools-filters _mgbt-24px _pdh-0px-md _pdh-4px">
        <div class="-left" v-if="optionsData.branches">
          <div class="branches">
            <SelectInput
              label="สาขา"
              :options="optionsData.branches"
              :value="branch"
              @input="(value) => onChangeData('branch', value)"
              allowEmpty
            />
          </div>
          <div class="date">
            <DatetimeRangePicker
              :value="dates"
              label="ระบุช่วงเวลา"
              @input="(value) => onChangeData('date', value)"
              :maxDate="new Date()"
            />
          </div>
          <div class="btn-apply" v-if="inputChangeCount > 1">
            <v-sl-button
              type="primary"
              @click="fetchData()"
              v-html="__getTerm('search')"
            ></v-sl-button>
          </div>
        </div>
      </div>
      <template v-if="rows.length">
        <Table
          :columns="columns"
          :rows="rows"
          @changeSort="(newSort) => (sort = newSort)"
          :actions="null"
          :sort="sort"
        >
          <template #head>
            <th>วันที่</th>
            <th>Status</th>
          </template>
          <template #content="{ row }">
            <td>
              <span>{{
                $moment(row.created_at).local().format("DD/MM/YYYY HH:mm")
              }}</span>
            </td>
            <td align="center">
              <sl-tag
                v-if="row.status == 'approved'"
                class="_mgh-2px"
                size="small"
                type="success"
              >
                <i class="far fa-check"></i>
                <span>Approve</span>
              </sl-tag>
              <sl-tag
                v-if="row.status == 'rejected'"
                class="_mgh-2px danger"
                size="small"
                type="danger"
              >
                <i class="far fa-times"></i>
                <span>Reject</span>
              </sl-tag>
            </td>
          </template>
        </Table>
      </template>
      <EmptyState label="ATK Logs" v-else />
      <Pagination
        :count="count"
        :activePage="page"
        @changePage="changePage"
        v-if="rows.length"
      />
    </template>
    <Loading :loading="true" :float="false" v-else />
  </div>
</template>

<script>
import SelectInput from "~/components/form/SelectInput";
import DatetimeRangePicker from "~/components/form/DatetimeRangePicker";
import moment from "moment";
export default {
  components: {
    SelectInput,
    DatetimeRangePicker,
  },
  layout: "admin",
  middleware: "auth",
  async asyncData({ store, params, redirect, error }) {
    const { type } = params;
    const configs = store.state.configs["atk-logs"];

    if (configs) {
      const {
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
      } = configs;

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
        // exportCSV,
        create: false,
        actions: {
          edit: false,
          view: false,
          remove: false,
        },
        ...(noLocalization
          ? { noLocalization: true }
          : { noLocalization: false }),
      };
    } else {
      error({ statusCode: 404 });
    }
  },
  data: () => {
    const now = new Date();
    return {
      loading: false,
      rows: null,
      count: null,
      page: 1,
      inputChangeCount: 0,
      sort: {
        key: "created_at",
        direction: "DESC",
      },
      optionsData: {
        branches: [],
      },
      branch: null,
      dates: {
        start: moment(now)
          .subtract({ day: 1 })
          .local()
          .format("YYYY-MM-DD HH:mm"),
        end: moment(now).local().format("YYYY-MM-DD HH:mm"),
      },
      exportCSV: {
        contentType: "atk-log",
      },
    };
  },
  async mounted() {
    this.fetchData(true);

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
      this.page = 1
      await this.changePage(this.page, newVal);
    },
  },
  methods: {
    getQueryString(limit = undefined) {
      return this.$qs.stringify({
        _where: {
          _and: [
            {
              created_at_gte: moment(this.dates.start)
                .utc()
                .format("YYYY-MM-DD HH:mm"),
            },
            {
              created_at_lte: moment(this.dates.end)
                .utc()
                .format("YYYY-MM-DD HH:mm"),
            },
          ],
        },
        ...(this.branch ? { branch: this.branch } : {}),
        _limit: limit,
      });
    },
    async fetchData(isMounted = false) {
      this.loading = true;
      const query = this.getQueryString();
      const { rows, count } = await this.__fetchContentType(
        {
          path: "atk-logs",
          query,
        },
        { sort: this.sort, page: 1 },
      );
      this.rows = rows;
      this.count = count;
      this.page = 1;
      this.loading = false;
      if (!isMounted) {
        this.inputChangeCount = 1;
      }
    },
    async changePage(page) {
      this.loading = true;
      const query = this.getQueryString();

      const data = await this.__changePage(
        page,
        {
          path: "atk-logs",
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
      } else if (type === "date") {
        this.dates = newValue;
      }
      this.inputChangeCount++;
    },
    handleExportCSV(contentType) {
      const query = this.getQueryString(-1);
      window.open(
        `${process.env.baseURL}/atk-logs/report/csv?${query}`,
        "_blank"
      );
      return;
    },
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

  > div {
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
</style>
