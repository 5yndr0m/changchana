<template>
  <div>
    <sl-dialog
      label="Media Gallery"
      class="media-gallery-modal"
      :open="active"
      @sl-request-close="(e) => $emit('close')"
    >
      <MediaGallery modal @select="(image) => handleImageSelect(image)" />
    </sl-dialog>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleImageSelect(image) {
      // console.log(image)
      this.$emit('select', image)
    }
  }
}
</script>

<style lang="scss" scoped>
.media-gallery-modal::part(base) {
  z-index: 9999;
  padding-left: 24px;
  padding-right: 24px;
}

.media-gallery-modal::part(panel) {
  width: 100%;
  max-width: 900px;
}

.media-gallery-modal::part(body) {
  padding-top: 0;
  padding-bottom: 0;
}

.media-gallery-modal::part(footer) {
  display: none;
}
// .media-gallery-modal {
//   min-width: 840px;
// }
// .wrapper {
//   width: 100%;
//   max-width: 840px;
// }
</style>
