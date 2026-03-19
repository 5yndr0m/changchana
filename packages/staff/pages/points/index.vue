<template>
  <div>
    <AppHeader
      :left="{
        text: 'Back',
        icon: 'chevron-left',
        callback: () => $router.push('/account'),
      }"
    />
    <div class="container _pdt-32px">
      <TextHeading title="Point Reduction" />
      <template v-if="!userId">
        <p class="_tal-ct _mgt-24px _mgbt-32px">
          แสกน QR ของลูกค้าเพื่อทำการหัก Point สะสม
        </p>
        <!-- <client-only>
          <qrcode-stream @decode="onDecode" @init="onInit" />
        </client-only> -->
        <client-only>
          <QRScanner @decode="onDecode" />
        </client-only>
      </template>
      <template v-else>
        <p class="_tal-ct _mgt-24px _mgbt-12px">
          ใส่ Point ที่ต้องการจะหัก<br />และกดปุ่มด้านล่างเพื่อทำการหัก Point
          สะสม
        </p>
        <p class="_tal-ct _mgbt-32px _cl-gray-900">
          <strong>User #{{ userId }}</strong>
        </p>
        <sl-input
          name="points"
          type="number"
          label="Points"
          min="0"
          :value="points"
          @sl-input="(e) => (points = e.target.value)"
          class="_mgbt-24px"
        ></sl-input>
        <sl-button
          type="primary"
          @click="pointReduction"
          class="_w-100pct _dp-b _mgt-24px"
          :loading="loading"
        >
          Submit
        </sl-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      success: false,
      error: false,
      points: 0,
      userId: null,
      loading: false,
    }
  },
  methods: {
    async onDecode(result) {
      this.userId = result
    },
    async pointReduction() {
      this.loading = true

      if (this.points < 0) {
        this.points = 0;
      }

      let data = {
        userId: this.userId,
        points: this.points,
        issueBy: this.$auth.user.id
      }

      let token = this.$auth.strategy.token.get()

      try {
        let response = await this.$axios.$post('/api/point-reduction', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.$store.commit('SET_BY_KEY', {
          key: 'pointsData',
          value: {
            ...response,
            points: this.points,
          },
        })

        // console.log(`response`, response)
        this.$router.push(`/points/success`)
      } catch (err) {
        console.log(err)
        this.$router.push(`/points/failed`)
      }
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>