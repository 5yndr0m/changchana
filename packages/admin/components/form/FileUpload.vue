<template>
  <div :class="{ '-disabled': disabled }">
    <MediaGalleryModal
      v-if="modalActive"
      :active="modalActive"
      @close="modalActive = false"
      @select="image => handleSelect(image)"
    />

    <label v-html="label" class="_dp-b"></label>
    <div class="file-upload">
      <div class="disabled-overlay" v-if="disabled"></div>

      <template v-if="!value">
        <div class="content" @click="modalActive = true">
          <i class="fas fa-cloud-upload"></i>
          <p>Click to select file</p>
        </div>
      </template>
      <div
        class="image"
        v-else-if="
          value.ext === '.jpg' || value.ext === '.jpeg' || value.ext === '.png'
        "
      >
        <div class="actions">
          <a :href="__formatURL(value.url)" target="_blank">
            <i class="fas fa-link"></i>
          </a>
          <i class="fas fa-times remove" @click="$emit('input', null)"></i>
        </div>
        <img :src="__formatURL(value.url)" alt="" />
      </div>
      <div class="file" v-else>
        <div class="actions">
          <a :href="__formatURL(value.url)" target="_blank">
            <i class="fas fa-link"></i>
          </a>
          <i class="fas fa-times remove" @click="$emit('input', null)"></i>
        </div>

        <div class="content">
          <div class="_fs-4"><i class="fas fa-file"></i></div>
          <h5
            class="_fs-6"
            v-html="
              value.name.length < 20
                ? value.name
                : value.name.slice(0, 20) + '...'
            "
          ></h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    modalActive: false,
  }),
  methods: {
    uploadImage(e) {
      // console.log(e)
    },
    handleSelect(image) {
      this.$emit('input', image)
      this.modalActive = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
