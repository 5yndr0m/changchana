<template>
  <client-only>
    <div v-if="viewMode === 'graph'">
      <div class="row">
        <div class="col-md-4 _mgbt-24px">
          <div class="dropdown">
            <SelectInput label="Event" placeholder="Select Event" :options="dropdown.events" :value="filter.eventId"
              @input="(value) => onChangeEvent(value)" />
          </div>
        </div>
        <div class="col-md-4 _mgbt-24px">
          <div class="dropdown">
            <SelectInput label="Round" placeholder="Select Round" :options="dropdown.rounds" :value="filter.roundId"
              @input="(value) => onChangeRound(value)" />
          </div>
        </div>
        <div class="col-md-4 _mgbt-24px _tal-r _pdt-8px">
          <i v-if="this.filter.roundId !== null" class="fas fa-project-diagram _fs-5 _cs-pt" :title="messages.compareData"
            @click="onShowDialogSelectCompare"></i>
        </div>
      </div>
      <div class="row" v-if="summary">
        <div class="col-md-4">
          <sl-card class="_pdbt-0px _pst-rlt">
            <div slot="header">
              <h3>{{ messages.totalTicketsSold }}</h3>
            </div>
            <div class="row">
              <Loading :loading="ticketLoading" />
              <div class="col-md-8 _pdl-0px _pdr-0px">
                <PercentCircle :percent="percentage(summary.ticket.paid, summary.ticket.total)"
                  progressBarColor="#1a7a89" />
              </div>
              <div class="col-md-4 _dp-f _jtfct-ct _alit-ct _pdl-0px _pdr-0px">
                <div class="_tal-ct">
                  <h3 class="_fs-4">{{ numberFormat(summary.ticket.paid) }}</h3>
                  <div class="_cl-gray-400">/ {{ numberFormat(summary.ticket.total) }}</div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row _tal-ct">
                  <div class="col-md-6">
                    <div>
                      <div class="dot dot-paid"></div> {{ messages.paid }}
                    </div>
                    <h3 class="_fs-5">{{ numberFormat(summary.ticket.paid) }}</h3>
                  </div>
                  <div class="col-md-6">
                    <div class="dot dot-total"></div> {{ messages.total }}
                    <h3 class="_fs-5">{{ numberFormat(summary.ticket.total) }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </sl-card>

          <sl-card class="_pdbt-0px _pst-rlt _mgt-16px">
            <div slot="header">
              <h3>{{ messages.totalTicketsSoldGender }}</h3>
            </div>
            <div class="row">
              <div class="col-md-12 _ovf-at">
                <DoughnutChart :chart-data="genderGraphData" :chart-options="{ cutout: 0 }" />
              </div>
            </div>
          </sl-card>
          <sl-card class="_pdbt-0px _pst-rlt _mgt-16px custom-card">
            <div slot="header">
              <div class="row">
                <div class="col-md-7">
                  <div class="wrap-text _fs-5 _fw-600">{{ messages.ticketSummary }}</div>
                </div>
                <div class="col-md-5 _tal-r">
                  <span class="_cl-gray-400">(THB)</span>
                </div>
              </div>
            </div>
            <div class="row">
              <Loading :loading="ticketLoading" />
              <div class="col-md-7">
                <div class="wrap-text">
                  {{ messages.grossTicketSales }}
                </div>
              </div>
              <div class="col-md-5 _tal-r">
                <div class="wrap-text">
                  {{ numberFormat(summary.sales.amount) }}
                </div>
              </div>
              <div class="col-md-7">
                <div class="wrap-text">
                  {{ messages.free }} <small>{{ messages.inclVat }}</small>
                </div>
              </div>
              <div class="col-md-5 _tal-r">
                <div class="wrap-text">
                  {{ numberFormat(summary.sales.fee) }}
                </div>
              </div>
              <div class="col-md-7">
                <div class="wrap-text">
                  <div>
                    {{ messages.paymentGatewayFree }}
                  </div>
                  <small>{{ messages.inclVat }}</small>
                </div>
              </div>
              <div class="col-md-5 _tal-r">
                <div class="wrap-text">
                  {{ numberFormat(summary.sales.paymentGatewayFee) }}
                </div>
              </div>
              <div class="col-md-12 _bdtw-1px _bdcl-gray-200 _mgt-8px">
                <div class="row _mgt-16px">
                  <div class="col-md-7">
                    <div class="wrap-text _fs-5 _fw-600">
                      {{ messages.netPrice }}
                    </div>
                  </div>
                  <div class="col-md-5 _tal-r">
                    <div class="wrap-text _fs-5 _fw-600">
                      {{ numberFormat(summary.sales.net) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </sl-card>
          <sl-card class="_pdbt-0px _pst-rlt _mgt-16px">
            <div slot="header">
              <div class="row">
                <div class="col-md-7">
                  <h3>{{ messages.pointUsedSummary }}</h3>
                </div>
                <div class="col-md-5 _tal-r">
                  <span class="_cl-gray-400">(points)</span>
                </div>
              </div>
            </div>
            <Loading :loading="ticketLoading" />
            <div class="row">
              <div class="col-md-7">
                {{ messages.pointUsed }}
              </div>
              <div class="col-md-5 _tal-r">
                {{ numberFormat(summary.points.used) }}
              </div>
            </div>
          </sl-card>
        </div>
        <div class="col-md-8">
          <sl-card class="_pdbt-0px _pst-rlt">
            <Loading :loading="false" />
            <div class="row _mgbt-8px _mgbt-24px">
              <div class="col-md-8">
                <h3>{{ messages.ticketByZone }}</h3>
              </div>
              <div class="col-md-4 _tal-r">
                <div class="_bgcl-gray-200 _bdrd-12px _dp-il _pdh-12px  _pdt-2px _pdbt-4px">
                  <span class="_mgr-8px">
                    <div class="dot dot-paid"></div> {{ messages.paid }}
                  </span>
                  <span>
                    <div class="dot dot-pending"></div> {{ messages.pending }}
                  </span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 _ovf-at ticket-sold-zone">
                <div v-for="( row, i ) in  summary.ticketByZone " :key="row.id"
                  :class="`row _pdt-8px _pdbt-8px _bdtcl-gray-200 _bdbtcl-gray-200 _bdbtw-1px ${i === 0 ? '_bdtw-1px' : ''}`">
                  <div class="col-md-4 _vtcal-md">
                    <p>{{ row.name }}</p>
                    <small class="_cl-gray-400">{{ formatterPrice(row.price) }}</small>
                  </div>
                  <div class="col-md-4 _vtcal-md">
                    <PercentBar :percent="percentage(row.ticket.paid, row.ticket.total)" />
                  </div>
                  <div class="col-md-2 _tal-r _vtcal-md _pdr-0px _pdl-0px">
                    <small>{{ row.ticket.paid }}/<span class="_cl-gray-300">{{ row.ticket.total }}</span></small>
                  </div>
                  <div class="col-md-2 _tal-r _vtcal-md">
                    <small><span class="ticket-paid">{{ row.ticket.paid }}</span>/<span class="ticket-pending">{{
                      row.ticket.pending }}</span></small>
                  </div>
                </div>
              </div>
            </div>
          </sl-card>
          <sl-card class="_mgt-16px">
            <div slot="header">
              <div class="row">
                <div class="col-md-7">
                  <h3>{{ messages.saleSummary }}</h3>
                </div>
                <div class="col-md-5 _tal-r">
                  <div class="_bgcl-gray-200 _bdrd-12px _dp-il _pdh-12px  _pdt-2px _pdbt-4px">
                    {{ this.graphDate }}
                  </div>
                  <div class="_bdrd-12px _pdh-12px  _pdt-2px _pdbt-4px _mgt-4px _dp-b">
                    <sl-switch :checked="showGraphDataPerHours"
                      @sl-change="e => showGraphDataPerHours = e.target.checked"></sl-switch> per hours
                  </div>
                </div>
              </div>
            </div>
            <Loading :loading="graphLoading" />
            <BarChart v-if="!showGraphDataPerHours" :chart-data="graphData" :chart-options="chartOptions" />
            <BarChart v-if="showGraphDataPerHours" :chart-data="graphDataPerHours" :chart-options="chartOptions" />
          </sl-card>
        </div>
      </div>

      <sl-dialog ref="dialogEventCompare" :label="messages.titleDialogCompare" class="modal-wrapper-event-list-compare"
        :noHeader="true">
        <ul>
          <li v-for="( event, i ) in  dropdown.events " v-if="event.value !== filter.eventId" :key="event.value"
            :class="eventCompare.length >= 2 && eventCompare.indexOf(event.value) < 0 ? 'disable' : ''">
            <input type="checkbox" :id="`eventcompare${event.value}`" v-model="eventCompare" :value="event.value"
              :disabled="eventCompare.length >= 2 && eventCompare.indexOf(event.value) < 0 ? true : false"
              class="_vtcal-md _mgr-4px" />
            <label :for="`eventcompare${event.value}`">{{ event.label }} </label>
          </li>
        </ul>
        <sl-button slot="footer" type="primary" @click="fetchEventDataCompare">
          {{ messages.compare }}</sl-button>
      </sl-dialog>
      <Loading :loading="loading" />
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-8 _mgbt-24px">
          <h1 class="_fs-4">{{ messages.titleEventCompare }}</h1>
        </div>
        <div class="col-md-4 _mgbt-24px _tal-r _pdt-8px">
          <i v-if="viewMode === 'compare'" class="fas fa-chart-pie _fs-5 _cs-pt" :title="messages.backToGraphView" @click="() => {
            viewMode = 'graph'
          }"></i>
        </div>
        <div class="col-md-12 _mgbt-24px">
          <Table :rows="eventCompareRow()" :actions="{
            edit: false,
            view: false,
            remove: false,
          }" class="_dp-b-md _dp-n tb-compare-event">
            <template #head>
              <th v-for="(row, i) in eventCompareHead">{{ row }}</th>
            </template>
            <template #content="{ row, index }">
              <td v-for="( data, i ) in row" class="_tal-ct">
                <div v-if="index === 6 && i !== 0" class="_mxw-256px _mg-at">
                  <DoughnutChart :chart-data="data" :chart-options="{ cutout: 0 }" />
                </div>
                <div v-else>
                  {{ data }}
                </div>
              </td>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import SelectInput from "~/components/form/SelectInput";
import PercentBar from '~/components/PercentBar';
import PercentCircle from '~/components/PercentCircle';

export default {
  layout: "admin",
  middleware: "auth",
  components: {
    PercentBar,
    PercentCircle,
    SelectInput,
  },
  async asyncData({ $axios }) {
    const events = await $axios.$get("/events/list?selling_type=ticket");
    const dropdown = {
      events: events.map(event => ({
        label: event.title,
        value: event.id,
      })),
      rounds: [],
    }

    return {
      loading: false,
      dropdown,
      summary: null,
      filter: {
        eventId: null,
        roundId: null,
      },
      ticketLoading: false,
      graphLoading: false,
      showGraphDataPerHours: false,
      showSwitchToCompareView: false,
      viewMode: "graph",  // graph | compare
      eventCompare: [],
      eventCompareData: [],
      messages: {
        ticketByZone: "Tickets sold by Zone",
        totalTicketsSold: "Total Tickets Sold",
        totalTicketsSoldGender: "Total Tickets Sold - Gender",
        pointUsedSummary: "Points used summary",
        saleSummary: "Sales summary",
        pointUsed: "Points used",
        ticketSummary: "Tickets summary",
        paid: "Paid",
        pending: "Pending",
        total: "Total",
        grossTicketSales: "Gross Ticket Sales",
        free: "TM Fee",
        paymentGatewayFree: "Payment Gateway Fee",
        inclVat: "[incl. VAT]",
        netPrice: "Net Price",
        gender: {
          male: "Male",
          female: "Female",
          other: "Other"
        },
        compareData: "Compare concert data",
        backToGraphView: "Back to graph view",
        titleEventCompare: "ข้อมูลการเปรียบเทียบ",
        titleDialogCompare: "เลือก event ที่ต้องการเปรียบเทียบ",
        compare: "เปรียบเทียบ",
      },
      graphData: {
        labels: [],
        datasets: [
          {
            label: 'Sales',
            backgroundColor: '#1a7a89',
            data: []
          },
          {
            label: 'Seat',
            backgroundColor: '#cccccc',
            data: []
          }
        ]
      },
      graphDataPerHours: {
        labels: [],
        datasets: [
          {
            label: 'Sales',
            backgroundColor: '#1a7a89',
            data: []
          }
        ]
      },
      genderGraphData: {
        labels: [],
        datasets: [{
          label: 'Total Tickets Sold - Gender',
          data: [],
          backgroundColor: [
            '#1A7A89',
            '#FAED00',
            '#CCCC'
          ],
          hoverOffset: 4
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      salesIndex: 0,
      seatIndex: 1,
    }
  },
  computed: {
    graphDate() {
      return `${this.graphData.labels[0]} - ${this.graphData.labels[this.graphData.labels.length - 1]}`
    },
    mainEvent() {
      return this.eventCompareData.find(row => row.id === this.filter.eventId);
    },
    eventCompareHead() {
      const title = this.eventCompareData.filter(row => row.id !== this.filter.eventId).map(row => row.title);
      return ["", this.mainEvent.title, ...title];
    }
  },
  methods: {
    async fetchData() {
      this.ticketLoading = true;
      this.graphLoading = true;

      const url = `/events/${this.filter.eventId}/summary?round_id=${this.filter.roundId}`;
      const summary = await this.$axios.$get(url);
      this.summary = summary;

      this.handleGraphDataGender(summary.buyerGender);
      this.handleGraphData(summary.event, summary.graphData);
      this.handleGraphDataPerHours(summary.graphDataPerHours);
      this.ticketLoading = false;
      this.graphLoading = false;
    },
    clearSummary() {
      this.summary = null;
      this.graphData.labels = [];
      this.graphData.datasets[this.salesIndex].data = [];
      this.graphData.datasets[this.seatIndex].data = [];
    },
    percentage(i, total) {
      return Number(((i / total) * 100).toFixed(2));
    },
    formatterPrice(price) {
      return `${this.numberFormat(price)} THB`
    },
    numberFormat: (num) => Number(num).toLocaleString(),
    handleGraphData(event, graphData) {
      const startDate = this.$moment(event.saleDate).local().format("YYYY-MM-DD");
      const endDate = this.dropdown.rounds.find(row => row.value === this.filter.roundId);

      var start = this.$moment(startDate);
      var stop = this.$moment(endDate.date).add(1, "days");

      const data = graphData && graphData.length ? graphData : [];
      let index = 0;
      while (start <= stop) {
        const startFormat = this.$moment(start).format("YYYY-MM-DD");
        this.graphData.labels.push(this.$moment(start).format("DD/MM/YYYY"));
        let seatTotal = 0;
        let saleTotal = 0;

        const gdata = data.find((d) => d.date === startFormat);

        if (gdata) {
          seatTotal = gdata.seatTotal;
          saleTotal = gdata.saleTotal;
        }

        this.graphData.datasets[this.seatIndex].data[index] = seatTotal;
        this.graphData.datasets[this.salesIndex].data[index] = saleTotal;

        start = this.$moment(start).add(1, "days");
        index++;
      }
    },
    handleGraphDataPerHours(data) {
      data.forEach((row, index) => {
        this.graphDataPerHours.labels.push(row.label);
        this.graphDataPerHours.datasets[0].data[index] = row.saleTotal;
      });
    },
    handleGraphDataGender(data) {
      this.genderGraphData.labels = Object.keys(data);
      this.genderGraphData.datasets[0].data = Object.values(data);
    },
    async onChangeEvent(value) {
      this.clearSummary();
      this.filter.eventId = value;
      this.filter.roundId = null;
      this.dropdown.rounds = [];
      this.viewMode = "graph";
      this.eventCompare = [];
      this.eventCompareData = [];
      this.showSwitchToCompareView = false;

      const rounds = await this.$axios.$get(`/events/${value}/rounds`);
      this.dropdown.rounds = rounds.map(round => ({
        label: round.date,
        value: round.id,
      }));
    },
    async onChangeRound(value) {
      this.clearSummary();
      this.filter.roundId = value;
      this.showSwitchToCompareView = true;
      if (value) {
        this.fetchData();
      }
    },
    async fetchEventDataCompare() {

      if (this.eventCompare.length === 0) {
        this.$swal({
          icon: "warning",
          title: "กรุณาเลือก",
          text: "กรุณาเลือก event/concert อย่างน้อย 1 event/concert เพื่อเปรียบเทียบข้อมูล",
        })

        return;
      }

      this.$refs.dialogEventCompare.hide();
      this.loading = true;
      let url = `/events/compare?${this.$qs.stringify({ events: [this.filter.eventId, ...this.eventCompare] })}`;
      const resp = await this.$axios.$get(url);

      this.eventCompareData = resp;
      this.viewMode = "compare";
      this.loading = false;
    },
    eventCompareRow() {
      const rows = [
        ["สาขา"],
        ["จำนวนรอบที่แสดง"],
        ["วันที่แสดง"],
        ["จำนวนโต๊ะ"],
        ["จำนวนที่ขายได้ (% ของโต๊ะทั้งหมด)"],
        ["point burn"],
        ["แยกตามเพศที่ซื้อ"],
      ];

      const pushToRows = (arr) => {
        const {
          branch = "",
          rounds = "",
          date = "",
          table = "",
          sales = "",
          points = "",
          gender = ""
        } = arr;
        rows[0].push(branch);
        rows[1].push(rounds);
        rows[2].push(date);
        rows[3].push(table);
        rows[4].push(sales);
        rows[5].push(points);
        rows[6].push(gender);
      }

      pushToRows(this.handleEventCompareRow(this.mainEvent));


      this.eventCompareData.forEach((row) => {
        if (row.id !== this.filter.eventId) {
          pushToRows(this.handleEventCompareRow(row));
        }
      });
      return rows;
    },
    handleEventCompareRow(event) {
      const rows = {
        branch: "",
        rounds: "",
        date: "",
        table: "",
        sales: "",
        points: "",
        gender: ""
      };
      let sales = 0;
      let points = 0;
      let numberOfTable = 0;
      const roundDate = [];

      rows.branch = event.branch.name;
      rows.rounds = event.rounds.length;

      event.zones.forEach(z => {
        numberOfTable += z.zoneData.number_of_table;
      });
      const table = numberOfTable * event.rounds.length;

      const gender = {
        male: 0,
        female: 0,
        other: 0,
      };
      event.transactions.map(t => {
        const count = t.description.split(", ");
        const len = count.length;
        sales += len;
        gender[t.user.gender] += len;
        points += t.points;
      });

      rows.points = this.numberFormat(points);
      rows.gender = {
        labels: Object.keys(gender),
        datasets: [{
          label: "",
          data: Object.values(gender),
          backgroundColor: this.genderGraphData.datasets[0].backgroundColor,
          hoverOffset: 4
        }]
      };

      event.rounds.map(r => {
        const date = this.$moment(r.date.date).format("DD/MM/YYYY");
        roundDate.push(date);
      });
      rows.date = roundDate.join(", ");
      rows.table = table;
      rows.sales = `${sales} (${this.percentage(sales, table)} %)`;

      return rows;
    },
    onShowDialogSelectCompare() {
      // this.showListCompareEvent = true;
      this.$refs.dialogEventCompare.show();
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~assets/styles/variables";

.dot {
  border-radius: 20px;
  width: 10px;
  height: 10px;
  display: inline-block;

  &.dot-paid {
    background-color: $primary-color;
  }

  &.dot-pending {
    background-color: $warning-color;
  }

  &.dot-total {
    background-color: $cl-gray;
  }
}

.ticket-paid,
.cl-primary {
  color: $primary-color;
}

.ticket-pending {
  color: $warning-color;
}

.ticket-sold-zone {
  max-height: 300px;
}

.wrap-text {
  margin-bottom: 8px;
}

.custom-card::part(base) {
  background-color: $primary-color;
  color: #FFFFFF;
}

.modal-wrapper-event-list-compare {
  max-height: 350px;
  overflow-y: auto;

  & li {
    padding: 10px 5px;
    list-style: none;

    & label {
      cursor: pointer;
      color: $heading-text-color;
    }

    &:nth-child(odd) {
      background: $bg-dark-gray;
    }

    &:hover {
      color: #FFFFFF;
      background-color: $primary-color;
    }

    &.disable {
      & label {
        cursor: not-allowed;
        color: #cecece;
      }
    }
  }
}

.tb-compare-event {
  & tbody tr td {
    border-top: 1px solid #FFFFFF;
    border-bottom: 1px solid #FFFFFF;
  }

  & thead th:nth-child(1),
  tbody td:nth-child(1) {
    background: $primary-color;
    color: #FFFFFF;
  }

  & thead th:nth-child(2),
  tbody td:nth-child(2) {
    background: #f4f4f4;
  }
}
</style>
