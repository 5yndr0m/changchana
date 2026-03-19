<template>
  <div class="_w-100pct _pst-rlt">
    <Loading :loading="loading" v-if="!modal" />

    <!-- Remove Modal -->
    <sl-dialog label="Delete Confirmation" ref="confirmImageDelete" class="dialog-overview">
      Please click the button below to confirm deletion of the data
      <sl-button slot="footer" type="primary" @click="confirmRemove">Remove</sl-button>
    </sl-dialog>

    <!-- Contents -->
    <sl-tab-group ref="mediaGalleryTabGroup">
      <sl-tab
        slot="nav"
        panel="gallery"
        :active="currentTab === 'gallery'"
        @click="currentTab = 'gallery'"
      >
        <i class="fas fa-images _mgr-8px"></i>
        <span v-html="__getTerm('all-images')"></span>
      </sl-tab>
      <sl-tab
        slot="nav"
        panel="upload"
        :active="currentTab === 'upload'"
        @click="currentTab = 'upload'"
      >
        <i class="fas fa-cloud-upload _mgr-8px"></i>
        <span v-html="__getTerm('upload')"></span>
      </sl-tab>

      <sl-tab-panel name="gallery" :active="currentTab === 'gallery'">
        <sl-card
          class="_pdbt-0px _pst-rlt"
          :borderWidth="modal ? '0px' : '1px'"
          borderTop="0px"
        >
          <Loading :loading="loading" v-if="modal" />

          <template v-if="rows !== null && count !== null">
            <template v-if="count > 0">
              <div class="row">
                <div
                  class="_mgbt-24px"
                  :class="{
                    'col-md-4': uploadArea,
                    'col-md-3': !uploadArea,
                  }"
                  v-for="val in rows"
                  :key="`file-${val.id}`"
                >
                  <ImageCard
                    :data="val"
                    @remove="triggerRemove(val.id)"
                    :class="{ '_cs-pt': modal }"
                    @click.native="$emit('select', val)"
                    :actions="!modal"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <EmptyState class="_mgbt-16px" label="Media" />
            </template>

            <div class="_bdtw-1px _bdcl-gray-200">
              <Pagination
                :count="count"
                :activePage="page"
                :perPage="12"
                @changePage="changePage"
              />
            </div>
          </template>
          <template v-else>
            <Loading
              :loading="true"
              :float="false"
              class="_pdt-32px _pdbt-48px"
            />
          </template>
        </sl-card>
      </sl-tab-panel>
      <sl-tab-panel name="upload" :active="currentTab === 'upload'">
        <sl-card class="image-upload-card" :borderWidth="modal ? '0px' : '1px'" borderTop="0px">
          <ImageUpload
            label="Media Upload"
            @cancel="uploadArea = false"
            @done="uploadDone()"
            class="_pdbt-24px"
          />
        </sl-card>
      </sl-tab-panel>
    </sl-tab-group>
  </div>
</template>

<script>
import ImageCard from '~/components/media/ImageCard'
import ImageUpload from '~/components/media/ImageUpload'

export default {
  layout: 'admin',
  components: {
    ImageCard,
    ImageUpload,
  },
  // computed: {
  //   _media () {
  //     return this.$store.state.media
  //   }
  // }
  props: {
    modal: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,
    rows: null,
    count: null,
    page: 1,
    removeModal: false,
    removeTarget: null,
    uploadArea: false,
    currentTab: 'gallery',
    // tabItems: [
    //   { name: 'all-images', icon: 'image' },
    //   { name: 'upload', icon: 'cloud-upload' },
    // ],
  }),
  methods: {
    async fetchData() {
      let { rows, count } = await this.__fetchMedia()
      this.rows = rows
      this.count = count
    },
    async changePage(i) {
      this.loading = true
      let data = await this.__changeMediaPage(i)
      this.page = i
      this.rows = data

      setTimeout(() => (this.loading = false), 1000)
    },
    triggerRemove(id) {
      this.removeModal = true
      this.removeTarget = id
      this.$refs.confirmImageDelete.show()
    },
    cancelRemove() {
      this.removeModal = false
      this.removeTarget = null
    },
    async confirmRemove() {
      this.$refs.confirmImageDelete.hide()
      this.removeModal = false
      this.loading = true

      try {
        let response = await this.$axios.$delete(
          `/upload/files/${this.removeTarget}`
        )
        this.changePage(this.page)
        setTimeout(() => (this.loading = false), 1000)
      } catch (err) {
        // console.log(err)
      }
      // this.$emit('delete', this.removeTarget)
    },
    async uploadDone() {
      await this.changePage(1)
      this.$refs.mediaGalleryTabGroup.show('gallery')
      this.currentTab = 'gallery'
    },
  },
  async mounted() {
    let { rows, count } = await this.__fetchMedia()
    setTimeout(() => {
      this.rows = rows
      this.count = count
    }, 2000)
  },
}
</script>

<style lang="scss" scoped>
sl-tab-panel::part(base) {
  padding: 24px 0 !important;
}

sl-card::part(body) {
  padding-bottom: 0 !important;
}

.image-upload-card {
  max-width: 470px !important;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
