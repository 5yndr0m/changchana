<template>
  <div>
    <AppHeader />
    <div class="container _pdt-32px">
      <SuccessContent title="หัก Point สะสมสำเร็จ!" :back="{
        label: 'Back to Scanner',
        path: '/points'
      }">
        <template v-slot:content>
          <p class="_tal-ct" v-if="_pointsData">
            <span>ทำการหัก Point สะสมของคุณ </span>
            <span
              v-html="
                _pointsData.user.first_name[0].toUpperCase() + _pointsData.user.first_name.slice(1)
              "
            ></span><br>
            <span>จำนวน </span>
            <span v-html="`${_pointsData.points} คะแนน`"></span>
            <span>เหลือ </span>
            <span v-html="`${_pointsData.newPoints} คะแนน`"></span>
            <br /> <br /><span>วันที่ทำรายการ: {{ $moment(new Date()).format("DD/MM/YYYY HH:mm:ss") }}</span>
          </p>
        </template>
      </SuccessContent>
    </div>
  </div>
</template>

<script>
import SuccessContent from '~/components/SuccessContent'

export default {
  middleware: 'auth',
  components: {
    SuccessContent,
  },
  data: () => ({
    user: null,
    points: null,
    newPoints: null,
  }),
  computed: {
    _pointsData() {
      return this.$store.state.pointsData
    }
  },
  // mounted() {
  //   let { data: rawdata } = this.$route.query
  //   let decoded = atob(rawdata)
  //   let data = JSON.parse(decoded)
  //   this.user = data.user
  //   this.points = data.points
  //   this.newPoints = data.newPoints
  // },
}
</script>