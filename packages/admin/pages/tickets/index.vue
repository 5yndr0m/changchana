<template>
  <div v-if="columns">
    <Loading :loading="loading" />
    <template>
      <Header :title="title" :count="count" unit="รายการ" />
      <div class="tools-filters _mgbt-24px _pdh-0px-md _pdh-4px">
        <div class="-left">
          <div class="dropdown">
            <SelectInput label="Event" placeholder="Select Event" :options="optionsData.dropdownEvents" :value="selectEventId"
              @input="(value) => onChangeEvent(value)" />
          </div>
          <div class="dropdown short">
            <SelectInput label="View By" :options="optionsData.dropdownViews" :value="viewBy"
              @input="(value) => onChangeViewBy(value)" />
          </div>
        </div>
        <div class="_dp-f _alit-ct _jtfct-ct">
          <v-sl-button type="info" @click="handleExportCSV();" v-html="__getTerm('export-csv')"></v-sl-button>
        </div>
      </div>
      
      <div class="tools-filters _mgbt-24px _pdh-0px-md _pdh-4px">
        <div class="-left">
          <div class="dropdown short" v-if="isViewByOrder">
            <SelectInput key="select_input_status" label="Status" :options="optionsData.dropdownTicketStatus" :value="filterStatus"
              @input="(value) => onChangeFilterStatus(value)" />
          </div>
          <div class="dropdown short" v-if="!isViewByOrder">
            <SelectInput key="select_input_zone" label="Zone" :options="optionsData.dropdownZones" :value="filterZone"
              @input="(value) => onChangeFilterZone(value)" />
          </div>
          <div class="seacrh-box">
            <TextInput
              label="&nbsp;"
              prefixIcon="search"
              maxlength="26"
              :clearable="true"
              :value="searchKeyword"
              placeholder="Booking No, Name, Email, Mobile"
              @input="(value) => (searchKeyword = value)"
              @clear="onClearSearch"
            />
          </div>
          <sl-button class="seacrh-btn" variant="default" @click="onSearch" outline>ค้นหา</sl-button>
        </div>
      </div>

      <template v-if="rows && rows.length">
        <Table :columns="columns" :rows="rows" @changeSort="(newSort) => (sort = newSort)" :actions="actions"
          :sort="sort">
        </Table>
        <Pagination :count="count" :activePage="page" :perPage="pageSize" @changePage="changePage"/>
      </template>
      <EmptyState v-else :label="title" />
      
    </template>
  </div>
</template>

<script>
import SelectInput from "~/components/form/SelectInput";
import TextInput from "~/components/form/TextInput";

const VIEW_ORDER = 'Order'
const VIEW_TICKET = 'Ticket'

const TICKET_STATUS = [
  "pending",
  "expired",
  "failed",
  "reversed",
  "successful",
  "refunded",
  "partial_refunded"
]

const removeColumnByKey = (columns, key) => {
  const index = columns.findIndex((col) => {
    const colKey = col.key.toString();
    return colKey == key;
  });
  if (index>=0) columns.splice(index, 1);
}

export default {
  components: {
    SelectInput,
    TextInput,
  },
  layout: "admin",
  middleware: "auth",
  async asyncData({ store, error }) {
    const configs = store.state.configs["tickets"];

    if (configs) {
      const { columns, title } = configs;
      const viewByOrderColumns = [...columns];
      removeColumnByKey(viewByOrderColumns, "zone_name");
      const viewByTicketColumns = [...columns];
      removeColumnByKey(viewByTicketColumns, "status");
      removeColumnByKey(viewByTicketColumns, "quantity");
      removeColumnByKey(viewByTicketColumns, "total");

      return {
        viewByOrderColumns,
        viewByTicketColumns,
        columns: viewByOrderColumns,
        title,
      };
    } else {
      error({ statusCode: 404 });
    }
  },
  data: () => {
    return {
      loading: false,
      selectEventId: null,
      viewBy: VIEW_ORDER,
      filterStatus: null,
      filterZone: null,
      searchKeyword: "",
      rows: null,
      count: null,
      page: 1,
      pageSize: 10,
      sort: {
        key: "created_at",
        direction: "DESC",
      },
      optionsData: {
        dropdownEvents: [],
        dropdownViews: [
          { label: VIEW_ORDER, value: VIEW_ORDER },
          { label: VIEW_TICKET, value: VIEW_TICKET },
        ],
        dropdownTicketStatus: [
          {
            label: "All",
            value: null,
          },
          ...TICKET_STATUS.map( s => ({ label: s, value: s })),
        ],
        dropdownZones: [],
      },
      actions: {
      },
      queryStrFilter: "",
    };
  },
  async mounted() {

    // Fetch Dropdown Events
    const events = await this.$axios.$get(`/events/list`);
    this.optionsData.dropdownEvents = [
      ...events.map((val) => ({
        label: val["title"],
        value: val["id"],
      })),
    ];

    this.fetchData();
  },
  watch: {
    async sort(sort) {
      this.page = 1;
      await this.changePage(this.page, sort);
    },
  },
  methods: {
    dtoTickets(tickets) {
      return tickets ? tickets.map(ticket => {
        const obj = {
          ticket_no: ticket.payment_transaction_id,
          status: ticket.status,
          name: `${ticket.user.first_name} ${ticket.user.last_name}`,
          email: ticket.user.email,
          phone: ticket.user.phone,
          created_at: this.$moment(ticket.created_at).local().format("DD/MM/YYYY HH:mm"),
        }
        if (this.viewBy === VIEW_ORDER) {
          obj.quantity = ticket.description?.split(", ").length || "-";
          obj.total = ticket.net_amount;
        }
        if (this.viewBy === VIEW_TICKET) {
          obj.zone_name = `${ticket.zone_name} (${ticket.description})`;
        }
        return obj
      }) : []
    },
    urlWithFilter(options) {

      const queryStr = {}
      if (options?.sort) {
        queryStr._sort = `${options.sort.key}:${options.sort.direction}`;
      }

      if (this.filterStatus) {
        queryStr.status = `${this.filterStatus}`;
      }

      if (this.viewBy === VIEW_TICKET && this.filterZone) {
        queryStr.zone = `${this.filterZone}`;
      }

      if (this.searchKeyword) {
        queryStr.keyword = `${this.searchKeyword}`;
      }

      return this.$qs.stringify(queryStr);
    },
    async fetchData(page = 1, options) {
      if (!this.selectEventId) return;

      this.loading = true;
      let url = `/events/${this.selectEventId}/${this.viewBy === VIEW_TICKET ? "zone" : ""}transactions`;
      url += `?page=${page}&pageSize=${this.pageSize}`;
      this.queryStrFilter = this.urlWithFilter(options);
      url += `&${this.queryStrFilter}`;

      const { rows, count, event } = await this.$axios.$get(url);
      this.rows = this.dtoTickets(rows);
      this.count = count;
      this.optionsData.dropdownZones = [
        {
          label: "All",
          value: null,
        },
        ...event.zones.map((val) => ({
          label: val["name"],
          value: val["name"],
        })),
      ];
      this.page = page;
      this.loading = false;
    },
    async changePage(page, sort) {
      this.page = page;
      const _sort = sort || this.sort;
      this.fetchData(this.page, { sort: _sort });
    },
    onChangeEvent(newEventId) {
      this.selectEventId = newEventId;
      this.fetchData();
    },
    async onChangeViewBy(newView) {
      if (newView == VIEW_ORDER) {
        this.columns = this.viewByOrderColumns
      } else if (newView == VIEW_TICKET) {
        this.columns = this.viewByTicketColumns
      }
      this.viewBy = newView;
      this.fetchData();
    },
    async onChangeFilterStatus(value) {
      this.filterStatus = value;
      this.fetchData();
    },
    async onChangeFilterZone(value) {
      this.filterZone = value;
      this.fetchData();
    },
    onClearSearch() {
      this.searchKeyword = "";
      this.onSearch();
    },
    async onSearch() {
      this.fetchData();
    },
    async handleExportCSV() {
      if (!this.selectEventId) return;
      this.loading = true;
      const fileName = `tickets-event_${this.selectEventId}_by_${this.viewBy}`;
      const exportType =  this.exportFromJSON.types.csv;
      let url = `/events/${this.selectEventId}/${this.viewBy === VIEW_TICKET ? "zone" : ""}transactions`;
      url += `?${this.queryStrFilter}`;
      const { rows } = await this.$axios.$get(url);
      const data = this.dtoTickets(rows);
      this.exportFromJSON({ data, fileName, exportType });
      this.loading = false;
    }
  },
  computed: {
    isViewByOrder() {
      return this.viewBy === VIEW_ORDER
    }
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
  flex-wrap: wrap;
  align-items: center;
  margin-left: -4px;
  margin-right: -4px;

  .seacrh-box {
    min-width: 260px;
  }
  .seacrh-btn {
    margin-top: 25px;
    width: 100px;
  }

  @media screen and (max-width: $md) {
    // display: block;
    flex-wrap: wrap;
  }

  >div {
    margin-left: 4px;
    margin-right: 8px;

    &.dropdown {
      min-width: 240px;
    }

    &.short {
      min-width: 120px;
    }

    @media screen and (max-width: $md) {
      margin-left: 0;
      // margin-right: 0;
      width: 100%;
      // margin-bottom: 8px;

      &:last-of-type {
        margin-bottom: 0;
      }

      &.dropdown {
        min-width: none;
      }

      &.status {
        min-width: none;
      }
    }
  }
}
</style>
