<template>
  <div class="container">
    <div class="qrcode-reader-wrapper">
      <div id="qr-code-full-region"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const config = {
      // fps: this.fps,
      // qrbox: this.qrbox,
    }
    const html5QrcodeScanner = new Html5Qrcode('qr-code-full-region')
    // html5QrcodeScanner.render(this.onScanSuccess);
    // console.log(html5QrcodeScanner)
    html5QrcodeScanner.start(
      { facingMode: 'environment' },
      config,
      this.onScanSuccess
    )
  },
  methods: {
    onScanSuccess(decodedText, decodedResult) {
      // console.log(decodedText)
      this.$emit('decode', decodedText)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 480px;
}
</style>
