<template>
  <div v-if="columns">
    <Loading :loading="loading" />
    <template v-if="rows !== null && count !== null">
      <Header title="รายการจอง" :count="count" unit="รายการ" create />
      <div class="booking-filters _mgbt-24px _pdh-0px-md _pdh-4px">
        <div class="-left" v-if="optionsData.branches">
          <div class="branches">
            <SelectInput
              label="Branch"
              :options="optionsData.branches"
              :value="filters.branch"
              @input="(value) => handleBranch(value)"
              allowEmpty
            />
          </div>
          <div class="status">
            <SelectInput
              label="Status"
              :options="optionsData.status"
              :value="filters.status"
              @input="(value) => handleStatus(value)"
              allowEmpty
            />
          </div>
          <div class="date">
            <Datepicker
              :value="filters.date"
              label="Date"
              :attributes="dateEvent"
              @input="(value) => handleDate(value)"
            />
          </div>
          <div class="btn-tools" v-if="enabledButtonSearch">
            <v-sl-button
              type="primary"
              @click="fetchData(true)"
              v-html="__getTerm('search')"
            ></v-sl-button>
          </div>
          <div
            class="btn-tools"
            v-if="
              enabledButtonFullyBooked &&
              filters.branch != null &&
              filters.date != null
            "
          >
            <v-sl-button
              type="info"
              @click="addFullyBooked()"
              v-html="__getTerm('add-fully-booked')"
            ></v-sl-button>
          </div>
        </div>
      </div>
      <div class="row _mgt-24px _mgbt-16px " v-if="bookingCount">
        <div class="col-3">
          <h4 class="_fs-6 _mgbt-8px">Approved</h4>
          <h5 class="_fs-6 _fw-500">
            <span class="_fs-5" v-html="bookingCount.approved.count"></span>
            <span
              class="_fs-7"
              v-html="`(${bookingCount.approved.amount})`"
            ></span>
          </h5>
        </div>
        <div class="col-3">
          <h4 class="_fs-6 _mgbt-8px">Reject</h4>
          <h5 class="_fs-6 _fw-500">
            <span class="_fs-5" v-html="bookingCount.reject.count"></span>
            <span
              class="_fs-7"
              v-html="`(${bookingCount.reject.amount})`"
            ></span>
          </h5>
        </div>
        <div class="col-3">
          <h4 class="_fs-6 _mgbt-8px">Pending</h4>
          <h5 class="_fs-6 _fw-500">
            <span class="_fs-5" v-html="bookingCount.pending.count"></span>
            <span
              class="_fs-7"
              v-html="`(${bookingCount.pending.amount})`"
            ></span>
          </h5>
        </div>
        <div class="col-3">
          <h4 class="_fs-6 _mgbt-8px">Cancelled</h4>
          <h5 class="_fs-6 _fw-500">
            <span class="_fs-5" v-html="bookingCount.cancelled.count"></span>
            <span
              class="_fs-7"
              v-html="`(${bookingCount.cancelled.amount})`"
            ></span>
          </h5>
        </div>
      </div>
      <template v-if="rows.length">
        <Table
          :columns="columns"
          :rows="rows"
          @changeSort="(newSort) => setSort(newSort, true)"
          @delete="remove"
          :actions="{
            edit: true,
            view: false,
            remove: true,
          }"
          class="_dp-b-md _dp-n"
          :sort="sort"
        >
          <template #head>
            <th></th>
          </template>
          <template #content="{ row }">
            <!-- {{ row.status }} -->
            <td>
              <template v-if="row.status === 'pending'">
                <div class="_dp-f _jtfct-fe _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="success"
                    @click="handleBooking(row.id, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="primary"
                    @click="handleBooking(row.id, 'waiting')"
                  >
                    <i class="far fa-clock"></i>
                    <span>Waiting</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="danger"
                    @click="handleBooking(row.id, 'reject')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
              <template v-if="row.status === 'waiting'">
                <div class="_dp-f _jtfct-fe _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="success"
                    @click="handleBooking(row.id, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="danger"
                    @click="handleBooking(row.id, 'reject')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
              <template v-if="row.status === 'approved'">
                <div class="_dp-f _jtfct-fe _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="danger"
                    @click="handleBooking(row.id, 'reject')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
              <template v-if="row.status === 'reject'">
                <div class="_dp-f _jtfct-fe _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="success"
                    @click="handleBooking(row.id, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="primary"
                    @click="handleBooking(row.id, 'waiting')"
                  >
                    <i class="far fa-clock"></i>
                    <span>Waiting</span>
                  </v-sl-button>
                </div>
              </template>
              <div class="_jtfct-fe _tal-r text-small mt-1">
                <p v-if="row.approved_at">
                  <small>Approved At: {{ row.approved_at }}</small>
                </p>
                <p v-if="row.waiting_time">
                  <small
                    ><i class="far fa-clock"></i> {{ row.waiting_time }}</small
                  >
                </p>
                <p>
                  <small
                    >Created at:
                    {{
                      $moment(row.created_at).local().format("DD/MM/YYYY HH:mm")
                    }}</small
                  >
                </p>
              </div>
            </td>
          </template>
        </Table>
        <div class="_dp-n-md">
          <sl-card
            class="booking-card _mgbt-24px"
            v-for="(row, r) in rows"
            :key="`mobile-row-${r}`"
          >
            <div class="_bdbtw-1px _bdcl-gray-200 _pdbt-16px _mgbt-12px">
              <div class="_dp-f _jtfct-spbtw _alit-ct">
                <div class="_dp-f _alit-ct">
                  <h4 class="_fs-6 _mgr-12px">#{{ row.id }}</h4>
                  <h4
                    class="_fs-6 _mgr-8px"
                    v-html="row.user ? `${row.user.first_name}` : ''"
                  ></h4>
                  <sl-tag type="warning" size="small">
                    <span
                      v-html="row.status ? __capitalize(row.status) : ''"
                    ></span>
                  </sl-tag>
                </div>
                <div class="_dp-f _alit-ct">
                  <nuxt-link :to="`/bookings/${row.id}`" class="_mgh-2px">
                    <i class="fas fa-external-link"></i>
                    <span>View</span>
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div>
              <div class="row">
                <div class="col-7 _mgbt-8px">
                  <label for="">Branch</label>
                  <p v-html="row.branch ? row.branch.name : ''"></p>
                </div>

                <div class="col-5 _mgbt-8px">
                  <label for="">Amount</label>
                  <p v-html="row.people_amount"></p>
                </div>

                <div class="col-7">
                  <label for="">Phone</label>
                  <p v-html="row.phone"></p>
                </div>

                <div class="col-5">
                  <label for="">Date</label>
                  <p v-html="row.date"></p>
                </div>
              </div>
            </div>
            <div
              class="_bdtw-1px _bdcl-gray-200 _pdt-16px _mgt-16px"
              v-if="row.status !== 'cancelled'"
            >
              <template v-if="row.status === 'pending'">
                <div class="_dp-f _jtfct-ct _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    type="success"
                    @click="handleBooking(row.id, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    type="primary"
                    @click="handleBooking(row.id, 'waiting')"
                  >
                    <i class="far fa-clock"></i>
                    <span>Waiting</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    type="danger"
                    @click="handleBooking(row.id, 'reject')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
              <template v-if="row.status === 'waiting'">
                <div class="_dp-f _jtfct-ct _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="success"
                    @click="handleBooking(row.id, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    size="small"
                    type="danger"
                    @click="handleBooking(row.id, 'reject')"
                  >
                    <i class="far fa-times"></i>
                    <span>Reject</span>
                  </v-sl-button>
                </div>
              </template>
              <template v-if="row.status === 'approved'">
                <div class="_dp-f _jtfct-ct _alit-ct">
                  <div>
                    <v-sl-button
                      class="_mgh-2px"
                      type="danger"
                      @click="handleBooking(row.id, 'reject')"
                    >
                      <i class="far fa-times"></i>
                      <span>Reject</span>
                    </v-sl-button>
                  </div>
                </div>
              </template>
              <template v-if="row.status === 'reject'">
                <div class="_dp-f _jtfct-ct _alit-ct">
                  <v-sl-button
                    class="_mgh-2px"
                    type="success"
                    @click="handleBooking(row.id, 'approved')"
                  >
                    <i class="far fa-check"></i>
                    <span>Approve</span>
                  </v-sl-button>
                  <v-sl-button
                    class="_mgh-2px"
                    type="primary"
                    @click="handleBooking(row.id, 'waiting')"
                  >
                    <i class="far fa-clock"></i>
                    <span>Waiting</span>
                  </v-sl-button>
                </div>
              </template>
              <div class="_jtfct-fe _tal-r text-small mt-1">
                <p v-if="row.approved_at">
                  <small>Approved At: {{ row.approved_at }}</small>
                </p>
                <p v-if="row.waiting_time">
                  <small
                    ><i class="far fa-clock"></i> {{ row.waiting_time }}</small
                  >
                </p>
                <p>
                  <small
                    >Created at:
                    {{
                      $moment(row.created_at).local().format("DD/MM/YYYY HH:mm")
                    }}</small
                  >
                </p>
              </div>
            </div>
          </sl-card>
        </div>
      </template>
      <EmptyState label="รายการจอง" v-else />
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
import Datepicker from "~/components/form/Datepicker";

export default {
  components: {
    SelectInput,
    Datepicker,
  },
  layout: "admin",
  middleware: "auth",
  data() {
    return {
      loading: false,
      rows: null,
      count: null,
      // page: 1,
      columns: [
        {
          label: "ID",
          key: "id",
          align: "left",
        },
        {
          label: "Branch",
          key: "branch.name",
          align: "left",
        },
        {
          label: "Name",
          key: "name",
          align: "center",
        },
        {
          label: "Phone",
          key: "phone",
          align: "center",
        },
        {
          label: "Amount",
          key: "people_amount",
          align: "center",
        },
        {
          label: "Status",
          key: "status",
          align: "center",
          displayAsTag: true,
          capitalize: true,
        },
        {
          label: "Date",
          key: "date",
          align: "center",
        },
      ],
      optionsData: {
        branches: null,
        status: [
          {
            label: "All",
            value: null,
          },
          {
            label: "Approved",
            value: "approved",
          },
          {
            label: "Pending",
            value: "pending",
          },
          {
            label: "Rejected",
            value: "reject",
          },
          {
            label: "Cancelled",
            value: "cancelled",
          },
          {
            label: "Waiting",
            value: "waiting",
          },
        ],
      },
      // Filter Data
      filters: {
        branch: null,
        status: null,
        date: null,
      },
      bookingCount: null,
      enabledButtonSearch: false,
      enabledButtonFullyBooked: false,
      sort: {
        key: "published_at",
        direction: "DESC",
      },
      dateEvent: [
        {
          key: "today",
          dot: true,
          dates: new Date(),
        },
      ],
    };
  },
  computed: {
    _currentLocale() {
      return this.$store.state.currentLocale;
    },
    page() {
      return this.$store.state.page;
    },
    _currentSort() {
      return this.$store.state.sort;
    },
    _currentFilters() {
      return this.$store.state.filters;
    },
    branchFilter() {
      return this.filters.branch;
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
    async fetchData(fromBtnSearch = false) {
      this.loading = true;
      // Gather all query data and turn it into queryString
      const { status, branch, date } = this.filters;
      const query = this.$qs.stringify({
        ...(status ? { status } : {}),
        ...(branch ? { branch } : {}),
        ...(date ? { date } : {}),
      });

      let { rows, count } = await this.__fetchContentType(
        {
          path: "bookings",
          query: query,
        },
        { sort: this.sort, page: 1 }
      );
      this.rows = rows;
      this.count = count;
      this.enabledButtonSearch = false;
      this.loading = false;
      this.enabledButtonFullyBooked = fromBtnSearch;

      if (date) {
        let countBooking = await this.$axios.$get(
          `/api/count-bookings?date=${date}${branch ? `&branch=${branch}` : ""}`
        );
        this.bookingCount = countBooking;
      }
    },
    async changePage(i, sort) {
      const _sort = sort || this.sort;
      const { status, branch, date } = this.filters;
      const query = this.$qs.stringify({
        ...(status ? { status } : {}),
        ...(branch ? { branch } : {}),
        ...(date ? { date } : {}),
      });

      const data = await this.__changePage(
        i,
        {
          path: "bookings",
          query: query,
        },
        _sort
      );

      this.rows = data;
    },
    async remove(id) {
      this.loading = true;

      try {
        let { count } = await this.__deleteContentType("bookings", id);
        await this.changePage(this.page);
        this.count = count;

        setTimeout(() => {
          this.loading = false;
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    },
    ///////////////////////////////////
    // Custom for Booking
    ///////////////////////////////////
    async handleBranch(branchID) {
      this.setFilters({ branch: branchID });
      this.enabledButtonSearch = true;
      this.fetchFullyBooked();
    },
    async handleBooking(id, status) {
      this.loading = true;
      try {
        await this.__saveContentType("bookings", id, {
          status,
        });

        const { branch, date } = this.filters;
        const query = this.$qs.stringify({
          ...(this.filters.status ? { status: this.filters.status } : {}),
          ...(branch ? { branch } : {}),
          ...(date ? { date } : {}),
        });

        const count = await this.$axios.$get(
          `/bookings/count?_publicationState=preview&${query}`
        );

        this.count = count;
        this.changePage(this.page);

        setTimeout(() => {
          this.loading = false;
        }, 2000);
      } catch (err) {
        let message = error.message;
        if (error.response && error.response.data) {
          message = error.response.data.message;
        }
        this.__showToast({
          type: "danger",
          title: "เพิ่มข้อมูลไม่สำเร็จ",
          message,
        });
      }
    },
    async handleStatus(newVal) {
      this.setFilters({ status: newVal });
      this.enabledButtonSearch = true;
    },
    async handleDate(newVal) {
      this.setFilters({ date: newVal });
      this.enabledButtonSearch = true;
    },
    async init() {
      let options = {};
      const previousContext = this.$nuxt.context.from;

      if (previousContext && previousContext.params.id) {
        const currentSort = this._currentSort || this.sort;
        const currentFilters = this._currentFilters || this.filters;

        const { status, branch, date } = currentFilters;
        const query = this.$qs.stringify({
          ...(status ? { status } : {}),
          ...(branch ? { branch } : {}),
          ...(date ? { date } : {}),
        });

        options = { page: this.page, query, sort: currentSort };
        this.sort = currentSort;
        this.filters = { ...this.filters, ...currentFilters };
      } else {
        options = { page: 1, query: "", sort: this.sort };
        this.setSort(this.sort, false);
        this.setFilters(this.filters);
      }

      const { rows, count } = await this.__fetchContentType(
        {
          path: "bookings",
          query: options.query,
        },
        { sort: options.sort, page: options.page }
      );

      this.rows = rows;
      this.count = count;
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
    setFilters(filters) {
      const _filters = {
        ...this.filters,
        ...filters,
      };
      this.filters = _filters;

      this.$store.commit("SET_BY_KEY", {
        key: "filters",
        value: _filters,
      });
    },
    addFullyBooked() {
      const date = this.$moment(this.filters.date).local().format("DD/MM/YYYY");
      const branch = this.optionsData.branches.find(
        (row) => row.value === this.filters.branch
      );
      this.$swal({
        title: "กรุณายืนยัน",
        text: `คุณต้องการกำหนดให้ ${date} ของสาขา ${branch.label} เป็น Fully Booked ใช่หรือไม่ ?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "confirm",
      }).then((result) => {
        if (result.value) {
          this.createFullyBooked();
        }
      });
    },
    async createFullyBooked() {
      try {
        this.loading = true;
        const date = this.$moment(this.filters.date)
          .local()
          .format("YYYY-MM-DD");
        const resp = await this.$axios.$post("/fully-bookeds", {
          branch: this.filters.branch,
          date,
          name: `Fully Booked @${date}`,
          published_at: new Date(),
          type: "full",
          visibility: "published",
        });
        this.__showToast({
          type: "success",
          title: "เพิ่มข้อมูลเรียบร้อย",
          message: "เพิ่มข้อมูล Fully Booked เรียบร้อย",
        });
        this.fetchFullyBooked();
      } catch (error) {
        let message = error.message;
        if (error.response && error.response.data) {
          message = error.response.data.message;
        }
        this.__showToast({
          type: "danger",
          title: "เพิ่มข้อมูลไม่สำเร็จ",
          message,
        });
      }
      this.loading = false;
    },
    async fetchFullyBooked() {
      const events = {
        full: {
          dot: {
            class: "booking-calendar-dot-fully-booked",
          },
          dates: [],
        },
        event: {
          dot: {
            class: "booking-calendar-dot-event",
          },
          dates: [],
        },
        closed: {
          dot: {
            class: "booking-calendar-dot-closed",
          },
          dates: [],
        },
      };

      if (this.filters.branch != null) {
        const now = this.$moment()
          .local()
          .subtract(1, "month")
          .format("YYYY-MM-DD");
        const resp = await this.$axios.$get(
          `/fully-bookeds?branch=${this.filters.branch}&date_gte=${now}&_limit=-1&_publicationState=preview&_sort=date%3ADESC`
        );
        resp.forEach((row) => {
          if (events[row.type]) {
            events[row.type].dates.push(new Date(row.date));
          }
        });
      }

      this.dateEvent = [
        {
          key: "today",
          dot: true,
          dates: new Date(),
        },
        events.full,
        events.event,
        events.closed,
      ];
    },
  },
  async mounted() {
    await this.init();

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
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.booking-filters {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media screen and (max-width: $md) {
    display: block;
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

      &.status {
        min-width: 120px;
      }

      &.date {
        width: 130px;
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

        &.date {
          width: 100%;
        }
      }
    }
  }

  .-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @media screen and (max-width: $md) {
      > div {
        flex: 1;
      }
    }
  }

  .btn-tools {
    margin-top: 25px;
  }
}
.text-small {
  color: #323738;
  font-size: 11px;
}

.booking-card {
  label {
    color: #738689;
    font-size: 12px;
    font-weight: 500;
  }

  p {
    color: #323738;
  }

  a {
    color: $primary-color;
    text-decoration: none;

    span {
      font-weight: 700;
    }
  }
}
</style>

<style lang="scss">
.booking-calendar-dot-fully-booked {
  background-color: #cb2731 !important;
}
.booking-calendar-dot-event {
  background-color: #ffb800 !important;
}
.booking-calendar-dot-closed {
  background-color: #999999 !important;
}
</style>