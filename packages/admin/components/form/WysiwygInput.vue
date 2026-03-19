<template>
  <div v-if="content !== null" :class="{ '-disabled': disabled }">
    <template v-if="mediaGallery">
      <MediaGalleryModal
        v-if="mediaGallery"
        :active="mediaGallery"
        @close="mediaGallery = false"
        @select="(image) => handleImageSelect(image)"
      />
    </template>
    <label for="" v-html="label"></label>
    <client-only>
      <div class="_pst-rlt">
        <div class="disabled-overlay" v-if="disabled"></div>
        <v-sl-button
          @click="mediaGallery = true"
          type="primary"
          class="_mgbt-12px"
        >
          <i class="fas fa-camera"></i>
          <span>Add Image</span>
        </v-sl-button>
        <quill-editor
          style="min-height: 300px"
          ref="editor"
          v-model="content"
          :options="editorOption"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      content: this.value || '',
      mediaGallery: false,
      editorOption: {
        // Some Quill options...
        theme: 'snow',
        modules: {
          toolbar: [
            // ['bold', 'italic', 'underline', 'strike'],
            // ['blockquote', 'code-block'],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ script: 'sub' }, { script: 'super' }],
            // [{ indent: '-1' }, { indent: '+1' }],
            // [{ direction: 'rtl' }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            // [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            // ['clean'],
            ['link', 'video'],
          ],
        },
      },
    }
  },
  watch: {
    content: {
      immediate: false,
      handler(newVal) {
        this.$emit('input', newVal)
      }
    },
    value: {
      immediate: false,
      handler(newVal) {
        this.content = newVal
      }
    }
  },
  methods: {
    handleImageSelect(image) {
      if (image) {
        if (image.mime.includes('image')) {
          let oldContent = this.content
          let imageContent = `<p><img src="${this.__formatURL(
            image.url
          )}" caption="${image.caption}" alt="${
            image.alternativeText
          }"></img></p>`
          this.content = `${oldContent}${imageContent}`
        }
      }

      this.mediaGallery = false
    },
  },
  mounted() {
    // this.content = this.value || ''
  },
}
</script>
