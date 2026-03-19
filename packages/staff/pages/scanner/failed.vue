<template>
  <div>
    <AppHeader />
    <div class="container _pdt-32px">
      <FailedContent title="ยืนยันผู้ใช้งานไม่สำเร็จ" :back="{
        label: 'Back to Scanner',
        path: '/scanner'
      }">
        <p class="_tal-ct">
          ไม่มีผู้ใช้งานนี้อยู่ในระบบ<br />หรือ ระบบเกิดข้อผิดพลาด
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
    FailedContent,
  },
}
</script>