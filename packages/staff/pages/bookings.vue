<template>
  <div>
    <AppHeader
      :left="{
        icon: 'chevron-left',
        text: 'Back',
        callback: () => $router.push('/account'),
      }"
    />
    <TextHeading title="Today's Bookings" class="_mgt-32px _mgbt-32px" />

    <div class="container" v-if="bookings">
      <h2 class="_fs-5 _tal-ct _mgbt-16px" v-html="_user.branch.name"></h2>
      <p class="_tal-ct _mgbt-32px">วันที่ <span v-html="$moment().format('DD MMMM YYYY')"></span>, <span v-html="bookings.length"></span> Booking</p>
      <div
        class="_mgbt-16px"
        v-for="(val, i) in bookings"
        :key="`booking-${i}`"
      >
        <a :href="`tel:${val.phone}`">
          <BookingCard
            :branch="val.name"
            :id="val.id"
            :amount="val.people_amount"
            :phone="val.phone"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import BookingCard from '~/components/BookingCard'

export default {
  middleware: 'auth',
  components: {
    BookingCard,
  },
  data: () => ({
    bookings: null,
  }),
  computed: {
    _user() {
      return this.$store.state.auth.user
    },
  },
  methods: {},
  async mounted() {
    console.log(this.$moment().format('YYYY-MM-DD'))

    try {
      let response = await this.$axios.$get(
        `/bookings?branch=${
          this._user.branch ? this._user.branch.id : ''
        }&status=approved&date=${this.$moment().format('YYYY-MM-DD')}&_limit=-1`
      )

      console.log(response)

      this.bookings = response
    } catch (err) {
      console.log(err)
    }
  },
}
</script>

<style lang="scss" scoped>
a {
  color: inherit;
}
</style>