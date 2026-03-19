<template>
  <div class="booking-card -approved">
    <div class="date">
      <h3 v-html="amount"></h3>
      <h4>คน</h4>
    </div>
    <div class="content">
      <h4 class="_ttf-upc _ltspc-1px">Booking ID — <span v-html="`#${id}`"></span></h4>
      <h2 v-html="branch"></h2>
      <div>
        <p v-html="phone"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    branch: {
      type: String,
      default: '',
    },
    id: {
      type: [Number, String],
      default: '',
    },
    amount: {
      type: [Number, String],
      default: '',
    },
    phone: {
      type: String,
      default: ''
    }
  },
}
</script>

<style scoped>
.booking-card {
  background: #ffffff;
  border: 1px solid #f4f4f4;
  box-sizing: border-box;
  box-shadow: 0px 10px 20px rgba(6, 63, 72, 0.1);
  border-radius: 6px;
  display: flex;
  overflow: hidden;
}

.booking-card .date {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 13px;
  flex: 0 0 90px;
}

.booking-card .date h3 {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #fff;
  line-height: 1;
}

.booking-card .date h4 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  color: #fff;
}

.booking-card.-approved .date {
  background-color: #1797AD;
}

.booking-card.-approved .content h4 {
  color: #1797AD;
}

.booking-card.-pending .date {
  background-color: #c4c4c4;
}

.booking-card.-pending .content h4 {
  color: #999;
}

.booking-card.-rejected .date {
  background-color: #cb2731;
}

.booking-card.-rejected .content h4 {
  color: #cb2731;
}

.booking-card .content {
  padding: 12px 16px;
}

.booking-card .content {
  flex: 1;
}

.booking-card .content h4,
.booking-card .content h2,
.booking-card .content p {
  margin: 0;
}

.booking-card .content h4 {
  font-size: 12px;
  font-weight: 700;
}

.booking-card .content h2 {
  font-size: 16px;
  font-weight: 700;
  margin-top: 7px;
  margin-bottom: 7px;
}

.booking-card .content p {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
}

.booking-card .content > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.booking-card .content > div > p:last-of-type {
  text-align: right;
}
</style>
