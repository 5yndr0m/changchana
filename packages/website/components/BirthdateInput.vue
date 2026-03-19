<template>
  <div class="row">
    <div class="col-md-12">
      <label for="birthdate">Birthday (วันเกิด)</label>
    </div>
    <div class="col-md-4 _mgbt-16px">
      <select
        class="form-select"
        :value="year"
        @change="(e) => (year = e.target.value)"
        required
      >
        <option selected disabled value="0">Year</option>
        <option v-for="item in listYear()" :key="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div class="col-md-5 _mgbt-16px">
      <select
        class="form-select"
        :value="month"
        @change="(e) => (month = e.target.value)"
        required
      >
        <option selected disabled value="0">Month</option>
        <option v-for="item in months" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
    <div class="col-md-3 _mgbt-16px">
      <select
        class="form-select"
        :value="day"
        @change="(e) => (day = e.target.value)"
        required
      >
        <option selected disabled value="0">Day</option>
        <option v-for="item in getLastDayOfMonth()" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    value: {
      type: String,
    },
  },
  data: () => {
    const date = moment().subtract(20, "years");
    return {
      startYear: date.format("YYYY"),
      year: "0",
      month: "0",
      day: "0",
      months: [
        { label: "มกราคม (Jan)", value: "01" },
        { label: "กุมภาพันธ์ (Feb)", value: "02" },
        { label: "มีนาคม (Mar)", value: "03" },
        { label: "เมษายน (Apr)", value: "04" },
        { label: "พฤษภาคม (May)", value: "05" },
        { label: "มิถุนายน (Jun)", value: "06" },
        { label: "กรกฎาคม (Jul)", value: "07" },
        { label: "สิงหาคม (Aug)", value: "08" },
        { label: "กันยายน (Sep)", value: "09" },
        { label: "ตุลาคม (Oct)", value: "10" },
        { label: "พฤศจิกายน (Nov)", value: "11" },
        { label: "ธันวาคม (Dec)", value: "12" },
      ],
    };
  },
  watch: {
    year(newValue) {
      this.day = "0";
      this.$emit("input", this.birthDate());
    },
    month(newValue) {
      this.day = "0";
      this.$emit("input", this.birthDate());
    },
    day(newValue) {
      this.$emit("input", this.birthDate());
    },
  },
  methods: {
    getLastDayOfMonth() {
      const date = moment(`${this.year}-${this.month}-01`, "YYYY-MM-DD");
      if (date.isValid()) {
        return Number(date.endOf("month").format("DD"));
      } else {
        return 31;
      }
    },
    listYear() {
      const years = [];
      for (let i = this.startYear; i >= this.startYear - 100; i--) {
        years.push(i);
      }
      return years;
    },
    birthDate() {
      const date = moment(
        `${this.year}-${this.month}-${this.day}`,
        "YYYY-MM-DD"
      );
      if (date.isValid()) {
        return date.format("YYYY-MM-DD");
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.password-input {
  position: relative;

  .icon {
    position: absolute;
    right: 1px;
    color: #000;
    font-size: 14px;
    cursor: pointer;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    height: calc(100% - 2px);
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    i {
      opacity: 0.5;
      transition: 0.3s;
    }

    &:hover {
      i {
        opacity: 1;
        transition: 0.3s;
      }
    }
  }
}
</style>