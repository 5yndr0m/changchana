<template>
  <div>
    <AppHeader />
    <div class="container _pdt-32px" v-if="_scannerData">
      <SuccessContent title="ยืนยันตัวตนสำเร็จ" :back="{
        label: 'Back to Scanner',
        path: `/scanner?type=${_scannerData.scannerType}`
      }">
        <template #remark>
          <p class="_tal-ct">
            วันที่
            <span v-html="$moment(_scannerData.date).format('YYYY-MM-DD')"></span>
            เวลา
            <span v-html="$moment(_scannerData.date).format('HH:mm')"></span>
          </p>
        </template>

        <template #content>
          <p class="_tal-ct">
            <span
              v-html="
                _scannerData.firstName[0].toUpperCase() +
                _scannerData.firstName.slice(1)
              "
            ></span>
            <span
              v-html="`${_scannerData.lastName[0].toUpperCase()}.`"
            ></span>
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
    firstName: null,
    lastName: null,
    date: null,
  }),
  computed: {
    _scannerData() {
      return this.$store.state.scannerData
    }
  },
}
</script>