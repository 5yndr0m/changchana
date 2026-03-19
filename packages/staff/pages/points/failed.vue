<template>
  <div>
    <AppHeader />
    <div class="container _pdt-32px">
      <FailedContent title="หักแต้มไม่สำเร็จ" :back="{
        label: 'Back to Points Reduction',
        path: '/points'
      }">
        <p class="_tal-ct">
          ผู้ใช้มีแต้มน้อยกว่าจำนวนแต้มที่จะหัก<br />หรือ ระบบเกิดข้อผิดพลาด
        </p>
      </FailedContent>
    </div>
  </div>
</template>

<script>
import FailedContent from '~/components/FailedContent'

export default {
  middleware: 'auth',
  components: {
    FailedContent
  }
}
</script>