<template>
  <div>
    <label for="" v-html="label"></label>
    <div class="wrap-qr">
      <qrcode-vue
        class="qrcode"
        :value="value"
        :size="size"
        level="H"
      ></qrcode-vue>
      <a :href="qrcodeUrl" download="qrcode-lucky-number.png">
        <v-sl-button type="primary">Download</v-sl-button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
  },
  data: () => ({
    size: 200,
    qrcodeUrl: "",
  }),
  mounted() {
    this.qrcodeUrl = document
      .querySelector(".qrcode canvas")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
  },
};
</script>

<style lang="scss" scoped>
.wrap-qr {
  text-align: center;
  .qrcode {
    width: 100%;
    margin-bottom: 15px;

    canvas {
      width: 100% !important;
      height: auto !important;
    }
  }
}
</style>
