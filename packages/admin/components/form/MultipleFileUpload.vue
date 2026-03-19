<template>
  <div :class="{ '-disabled': disabled }">
    <MediaGalleryModal
      v-if="modalActive"
      :active="modalActive"
      @close="modalActive = false"
      @select="image => handleSelect(image)"
    />

    <div class="field-group _pdh-16px">
      <div class="field-group-heading">
        <label v-html="label" class="_dp-b"></label>
        <v-sl-button size="small" type="text" @click="addFile">
          <i class="fas fa-plus _fs-7 _mgr-4px"></i>
          <span v-html="__getTerm('add')"></span>
        </v-sl-button>
      </div>
      <div
        class="_mgbt-8px"
        v-for="(val, i) in value"
        :key="`multiple-file-${i}`"
      >
        <Accordion
          :title="__getAccordionLabel(val, 'name')"
          :drag="false"
          @remove="handleRemove(i)"
          :active="activeCollapse === i"
          @toggle="
            status => (status ? (activeCollapse = i) : (activeCollapse = null))
          "
        >
          <div class="row">
            <div class="col-md-6">
              <label for="" class="_dp-b _mgbt-8px">File</label>

              <div
                class="file-upload"
                :class="{
                  '-file': val
                    ? !(val.ext === '.jpg' || val.ext === '.jpeg')
                    : false,
                }"
              >
                <div class="disabled-overlay" v-if="disabled"></div>

                <template v-if="!val">
                  <div class="content" @click="openModal(i)">
                    <i class="fas fa-cloud-upload"></i>
                    <p>Click to select file</p>
                  </div>
                </template>
                <div
                  class="image"
                  v-else-if="
                    val.ext === '.jpg' ||
                      val.ext === '.jpeg' ||
                      val.ext === '.png'
                  "
                >
                  <div class="actions">
                    <a :href="val.url" target="_blank">
                      <i class="fas fa-link"></i>
                    </a>
                    <i class="fas fa-times remove" @click="clearImage(i)"></i>
                  </div>
                  <img :src="val.url" alt="" />
                </div>
                <div class="file" v-else>
                  <div class="actions">
                    <a :href="val.url" target="_blank">
                      <i class="fas fa-link"></i>
                    </a>
                    <i class="fas fa-times remove" @click="clearImage(i)"></i>
                  </div>

                  <div class="content">
                    <div class="_fs-4"><i class="fas fa-file"></i></div>
                    <h5
                      class="_fs-6"
                      v-html="
                        val.name.length < 20
                          ? val.name
                          : val.name.slice(0, 20) + '...'
                      "
                    ></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: [Object, Array],
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    modalActive: false,
    currentImageIndex: null,
    activeCollapse: null,
  }),
  methods: {
    handleSelect(image) {
      let data = this.value ? this.value : []
      data[this.currentImageIndex] = image
      this.$emit('input', data)
      this.modalActive = false
    },
    handleRemove(i) {
      this.activeCollapse = null
      let data = this.value
      data.splice(i, 1)
      this.$emit('input', data)
    },
    clearImage(i) {
      let data = JSON.parse(JSON.stringify(this.value))
      data[i] = null
      // console.log(data)
      this.$emit('input', data)
    },
    openModal(i) {
      this.modalActive = true
      this.currentImageIndex = i
    },
    addFile() {
      this.$emit('input', [...(this.value ? this.value : []), null])
    },
  },
}
</script>

<style lang="scss" scoped></style>
