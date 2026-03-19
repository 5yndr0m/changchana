<template>
  <div class="file-upload-wrapper">
    <label v-html="label" class="_mgbt-12px _dp-b"></label>
    <div class="file-upload">
      <div class="loading-blinder" v-if="loading"></div>
      <template v-if="!files && !filePreview">
        <input type="file" name="" id="" @change="e => prepareImage(e)" />
        <div class="content">
          <i class="fas fa-cloud-upload"></i>
          <p>Click to select file</p>
        </div>
      </template>
      <div class="image-preview" v-if="files">
        <div class="actions">
          <i
            class="fas fa-times remove"
            @click="files = filePreview = null"
          ></i>
        </div>
        <div
          class="image"
          v-if="filePreview"
          :style="{ backgroundImage: `url('${filePreview}')` }"
        ></div>
        <div class="file" v-else>
          <div>
            <i class="fas fa-file"></i>
            <p v-html="files[0].name"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="_dp-f _jtfct-fe _alit-ct _mgt-24px">
      <v-sl-button
        @click="uploadImage"
        type="primary"
        :disabled="!files"
        :loading="loading"
        class="_mgl-8px"
        v-html="__getTerm('upload')"
      ></v-sl-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
  data: () => ({
    files: null,
    filePreview: null,
    loading: false,
  }),
  methods: {
    prepareImage(e) {
      // console.log(e)
      let files = e.target.files[0]
      // console.log(e.target.files[0])
      let ext = this.__getExtension(files.name)
      console.log('ext', ext)
      this.files = e.target.files
      let imageExt = ['jpg', 'png', 'jpeg']
      this.filePreview = ext ? imageExt.includes(ext) ? URL.createObjectURL(files) : null : null
    },
    async uploadImage(e) {
      // console.log(e)
      // e.preventDefault()
      this.loading = true
      try {
        let response = await this.__uploadFile(this.files)
        // console.log(response)
        // this.files = null
        // this.filePreview = null
        this.cancel()
        this.$emit('done')
        setTimeout(() => (this.loading = false), 1000)
      } catch (err) {
        // console.log(err)
        this.loading = false
      }
    },
    cancel(e) {
      // e.preventDefault()
      this.files = null
      this.filePreview = null
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="scss" scoped>
.file-upload-wrapper {
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.file-upload {
  width: 100%;
  // padding: 32px;
  position: relative;
  cursor: pointer;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0;
  }

  .loading-blinder {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 5;
    background: rgba(255, 255, 255, 0.4);
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 32px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px dashed #bcc3ce;
    // border: 1px solid #bcc3ce;
    background-color: #fff;
    border-radius: 5px;
    transition: background 0.3s;
    cursor: pointer;

    i {
      font-size: 18px;
      color: #999;
    }

    p {
      margin-top: 8px;
      font-size: 14px;
    }
  }

  .image-preview {
    border: 1px solid rgb(207, 207, 207);
    border-radius: 5px;
    overflow: hidden;

    .file {
      width: 100%;
      height: auto;
      padding: 32px;
      position: relative;
      border-radius: 5px;
      
      > div {
        text-align: center;

        i {
          font-size: 24px;
          opacity: .4;
        }

        p {
          margin-top: 8px;
        }
      }
    }

    .image {
      width: 100%;
      height: auto;
      padding-top: 60%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-color: #e2e2e2;
    }

    .actions {
      position: absolute;
      top: 9px;
      right: 9px;
      border-radius: 4px;
      background-color: #fff;
      padding: 4px 2px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;

      > * {
        cursor: pointer;
      }

      .upload {
        position: relative;
        cursor: pointer;

        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      }

      i {
        color: #666;
        margin-left: 6px;
        margin-right: 6px;

        &.remove {
          color: #de5200 !important;
        }
      }
    }
  }

  &:hover {
    .content {
      background: rgba(#bcc3ce, 0.1);
      transition: background 0.3s;
    }
  }
}
</style>
