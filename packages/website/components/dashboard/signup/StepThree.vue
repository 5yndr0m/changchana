<template>
  <div>
    <p class="_tal-ct _mgbt-24px">
      Please add a photo you to verify your identity.
    </p>

    <div
      class="image-upload"
      :style="{ backgroundImage: `url('${preview ? preview : ''}')` }"
    >
      <div class="close-icon" @click="clearImage" v-if="preview && formData.files">
        <i class="fas fa-times"></i>
      </div>
      <div class="icon" v-if="!formData.files && !preview">
        <i class="fas fa-camera"></i>
      </div>
      <input type="file" name="" id="" @change="handleFile" />
    </div>

    <button class="btn btn-primary _w-100pct _mgt-32px" @click="handleSubmit"
      >Next</button
    >
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    formData: {
      files: null,
    },
    preview: null,
  }),
  watch: {
    formData: {
      deep: true,
      handler() {
        this.$emit('update', this.formData)
      },
    },
  },
  methods: {
    handleFile(e) {
      const file = e.target.files[0];
      const sizeLimit = 1024 * 1024 * 10; // 10MB

      if (file) {
        if (file.size > sizeLimit) {
          const sizeMB = sizeLimit / (1024 * 1024);

          return this.__showToast({
            title: `The maximum file size limit ${(Math.round(sizeMB * 100) / 100).toFixed(2) } MB`,
            description: "",
            type: "danger",
          });
        } else if (file.type.split("/")[0] !== "image") {
          return this.__showToast({
            title: `Please upload file image only`,
            description: "",
            type: "danger",
          });
        }

        this.formData.files = file
        this.preview = URL.createObjectURL(file)
      }
    },
    handleSubmit() {
      if (this.formData.files) {
        this.$emit('next', this.formData)
      } else {
        // this.__toastAlert('error', {
        //   title: 'Please add your photo!',
        //   description: 'The photo is needed for verifying your identity.',
        // })
        this.__showToast({
          title: 'Please add your photo!',
          description: 'The photo is needed for verifying your identity',
          type: 'danger'
        })
      }
    },
    clearImage() {
      this.formData.files = null
      this.preview = null
    },
  },
  mounted() {
    if (this.data) {
      if (this.data.files) {
        this.formData.files = this.data.files
        this.preview = URL.createObjectURL(this.data.files)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.image-upload {
  width: 100%;
  height: auto;
  padding-top: 100%;
  border-radius: 6px;
  background-color: #e2e2e2;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .close-icon {
    width: 27px;
    height: 27px;
    border-radius: 100%;
    background: #1797ad;
    position: absolute;
    top: 11px;
    right: 11px;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .icon {
    font-size: 32px;
    color: rgba(#000, 0.5);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
