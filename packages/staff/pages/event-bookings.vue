<template>
  <div>
    <AppHeader :left="{
      icon: 'chevron-left',
      text: 'Back',
      callback: () => $router.push('/account'),
    }" />
    <TextHeading title="Today's Event bookings" class="_mgt-32px _mgbt-32px" />

    <div class="container">
      <div>
        <h2 class="_fs-5 _tal-ct _mgbt-16px" v-html="_user.branch.name"></h2>
        <p class="_tal-ct _mgbt-32px">วันที่ <span v-html="$moment().format('DD MMMM YYYY')"></span>,
          <span>{{ bookings.length }}</span> Booking
        </p>
        <div class="row _mgt-32px _mgbt-16px">
          <div class="col-10 _pdr-8px">
            <sl-input :value="filter.name" @input="event => filter.name = event.target.value"
              placeholder="กรอกเพื่อค้นหาชื่อลูกค้า"></sl-input>
          </div>
          <div class="col-2 _pdr-8px">
            <sl-checkbox :val="filter.beforeAfterDate"
              @sl-change="event => featchData(event.target.checked)">ค้นหา +- 1 วัน</sl-checkbox>
          </div>
          <div class="col-md-12 col-sm-12 _pdr-8px _mgt-8px">
            <v-sl-button type="primary" @click="filterData" :disabled="filter.name === ''" class="_dp-b _mgbt-12px">ค้นหา</v-sl-button>
          </div>
          <div class="col-md-12 col-sm-12 _pdr-8px">
            <v-sl-button v-if="filter.name !== '' || filter.status !== ''" type="danger" @click="clearData"
              class="_dp-b _mgbt-12px">ล้าง</v-sl-button>
          </div>
        </div>
      </div>
      <template v-if="list.length > 0">
        <div class="_mgbt-16px" v-for="(row, i) in list" :key="`booking-${i}`">
          <a :href="`tel:${row.user.phone}`">
            <EventBookingCard :id="row.id" :user="row.user" :booking="row" />
          </a>
        </div>
      </template>
      <template v-else>
        <h3 class="_tal-ct">ไม่พบข้อมูล</h3>
      </template>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import EventBookingCard from "~/components/EventBookingCard";

export default {
  middleware: "auth",
  components: {
    EventBookingCard,
  },
  data: () => {
    return {
      list: [],
      bookings: [],
      zones: {},
      filter: {
        status: "",
        name: "",
        // beforeAfterDate: 0,
      },
    };
  },
  computed: {
    _user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    async featchData(expandPeriod) {
      try {
        const filter = {
          "branch": this._user.branch?.id || "",
        };

        if(expandPeriod) {
          filter.expandPeriod = true;
        }

        if (this.filter.status) {
          filter.status = [this.filter.status];
        }

        if (this.filter.name) {
          filter.name = this.filter.name;
        }

        const response = await this.$axios.$get(`/api/event-transaction/booking-today?${qs.stringify(filter)}`);
        this.list = response.bookings;
        this.bookings = this.list;
        this.zones = response.zones;

      } catch (err) {
        console.log(err);
      }
    },
    filterData() {
      console.log("call filterData");
      this.list = this.bookings.filter(row => {
        let resp = true;

        if (this.filter.name !== "" && resp === true) {
          const search = this.filter.name.toLowerCase();
          const user = row.user?.first_name?.toLowerCase() || "";
          resp = user.startsWith(search);
        }

        if (this.filter.status !== "" && resp === true) {
          resp = this.filter.status === row.status;
        }

        return resp;
      });
    },
    clearData() {
      this.filter.status = "";
      this.filter.name = "";
      this.list = this.bookings;
    }
  },
  async mounted() {
    this.featchData();
  },
}
</script>

<style lang="scss" scoped>
a {
  color: inherit;
}
</style>