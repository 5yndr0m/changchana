<template>
  <div v-if="columns">
    <Loading :loading="loading" />
    <template v-if="rows !== null && count !== null">
      <div class="_dp-f-md _jtfct-spbtw _alit-ct _mgbt-24px">
        <div class="_fs-3-md _fs-4 _tal-l-md _tal-ct ">
          <i class="fas fa-chevron-left icon-back _fs-7" @click="back"></i>
          <h5 class="_dp-il _fs-7">{{ title }}</h5>
          <span v-if="count" class="_mgl-16px-md _mgt-0px-md _mgt-8px _fs-8">{{ `ทั้งหมด
          ${count}
          รายการ`}}</span>
        </div>
        <div class="_dp-f-md _dp-n _alit-ct _jtfct-ct">
          <v-sl-button type="info" @click="handleExportCSV()" v-html="__getTerm('export-csv')"></v-sl-button>
        </div>
      </div>
      <template v-if="rows.length">
        <Table :columns="columns" :rows="rows" @changeSort="(newSort) => (sort = newSort)" :actions="{
          edit: false,
          view: false,
          remove: false,
        }" :sort="sort">
          <template #head>
            <th>รอบวันที่ (โต๊ะที่)</th>
            <th>สร้างเมื่อ</th>
            <th width="30" class="action">#</th>
          </template>
          <template #content="{ row }">
            <td>
              <sl-tag type="secondary" size="small" class="_mgbt-2px _mgl-2px">
                {{ getBookingDetail(row) }}
              </sl-tag>
            </td>
            <td>{{ $moment(row.created_at).local().format("DD/MM/YYYY HH:mm") }}</td>
            <td>
              <v-sl-button v-if="(row.status === 'successful' && row.payment_method === 'card')" type="danger" @click="onConfirmRefund(row)"
                v-html="__getTerm('refund')">
              </v-sl-button>
            </td>
          </template>
        </Table>
      </template>
      <EmptyState :label="title" v-else />
      <Pagination :count="count" :perPage="pageSize" :activePage="page" @changePage="changePage" v-if="rows.length" />
    </template>
    <Loading :loading="true" :float="false" v-else />
  </div>
</template>

<script>
import moment from "moment";
import SelectInput from "~/components/form/SelectInput";
export default {
  components: {
    SelectInput,
  },
  layout: "admin",
  middleware: "auth",
  async asyncData({ store, error }) {
    const configs = store.state.configs["event-transactions"];

    if (configs) {
      const { columns, defaultSort, title, linkBack } = configs;

      return {
        columns,
        defaultSort,
        title,
        actions: {
          edit: true,
          view: true,
          remove: true,
        },
        linkBack,
      };
    } else {
      error({ statusCode: 404 });
    }
  },
  data: () => {
    return {
      contentType: "events",
      loading: false,
      rows: null,
      count: null,
      page: 1,
      pageSize: 10,
      sort: {
        key: "id",
        direction: "DESC",
      },
      optionsData: {
        branches: [],
      },
      branch: null,
      event: {
        rounds: [],
        zones: []
      }
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
    async sort(sort) {
      this.page = 1;
      await this.changePage(this.page, sort);
    },
  },
  methods: {
    back() {
      this.$router.push(`/${this.contentType}/${this.$route.params.id}`);
    },
    async fetchData(page = 1, options) {
      this.loading = true;
      let url = `/${this.contentType}/${this.$route.params.id}/transactions?page=${page}&pageSize=${this.pageSize}`;

      if (options?.sort) {
        url += "&" + this.$qs.stringify({ _sort: `${options.sort.key}:${options.sort.direction}` });
      }

      const { rows, count, event } = await this.$axios.$get(url);
      this.rows = rows;
      this.count = count;
      this.event = event;
      this.page = page;
      this.loading = false;
    },
    async changePage(page, sort) {
      this.page = page;
      const _sort = sort || this.sort;
      this.fetchData(this.page, { sort: _sort });
    },
    getBookingDetail(transaction) {
      const rounds = this.event.rounds;
      const date = rounds.find(round => round.id === transaction.round_id);
      return `${moment(date?.date || null).format("DD/MM/YYYY")} (${transaction.description})`;
    },
    onConfirmRefund(transaction) {
      this.$swal({
        title: `กรุณายืนยัน`,
        html: `คุณต้องการ${this.__getTerm('refund')} ของรายการ#${transaction.id} 
        <br>ยอดเงิน: ${transaction.price} และคะแนน: ${transaction.points} คะแนน`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.onRefund(transaction);
        }
      });
    },
    async onRefund(transaction) {
      this.loading = true;
      const { success, data, description } = await this.$axios.$patch(`/event-transaction/${transaction.id}/refund`, {
        payment_transaction: transaction.payment_transaction_id,
      });

      if (!success && description) {
        this.$swal({
          title: "ผลการคืนเงิน",
          text: description,
          icon: "warning",
          showCancelButton: false,
        });
      }

      if (data) {
        this.$swal({
          title: "ผลการคืนเงิน",
          html: `การคืนเงินสำเร็จ <br /> #Transaction ID: ${data.transaction}`,
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก",
          reverseButtons: true,
          allowOutsideClick: false,
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.fetchData();
          }
        });
      }
      this.loading = false;
    },
    async handleExportCSV() {
      this.loading = true;
      const fileName = `event_${this.$route.params.id}_transactions`;
      const exportType =  this.exportFromJSON.types.csv;
      const data = await this.$axios.$get(`/events/${this.$route.params.id}/report/transactions`);
      this.exportFromJSON({ data, fileName, exportType });
      this.loading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.icon-back {
  cursor: pointer;
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
    }
  }
}

.link-w-icon {
  color: #11545E;
}
</style>
